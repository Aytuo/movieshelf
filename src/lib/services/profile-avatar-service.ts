import 'server-only';

import { del, list, put } from '@vercel/blob';

export const MAX_AVATAR_SIZE = 3 * 1024 * 1024;

const FETCH_TIMEOUT_MS = 10_000;

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const AVATAR_PROVIDER_BY_HOST: Record<string, 'google' | 'discord'> = {
  'lh3.googleusercontent.com': 'google',
  'cdn.discordapp.com': 'discord',
};

const ALLOWED_PROVIDER_AVATAR_HOSTS = new Set(
  Object.keys(AVATAR_PROVIDER_BY_HOST)
);

function normalizeContentType(value: string | null | undefined) {
  return (value ?? '').split(';', 1)[0].trim().toLowerCase();
}

function validateContentType(contentType: string) {
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error('Unsupported image format.');
  }
}

function detectImageContentType(bytes: Uint8Array): string | null {
  // JPEG
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return 'image/jpeg';
  }

  // PNG
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

function validateImageBytes(bytes: Uint8Array, contentType: string) {
  validateContentType(contentType);

  if (bytes.byteLength > MAX_AVATAR_SIZE) {
    throw new Error('Avatar image cannot exceed 3 MB.');
  }

  if (detectImageContentType(bytes) !== contentType) {
    throw new Error('Image content does not match its declared format.');
  }
}

function parseProviderAvatarUrl(value: string): URL {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error('Invalid provider avatar URL.');
  }

  if (
    url.protocol !== 'https:' ||
    url.username !== '' ||
    url.password !== '' ||
    url.port !== '' ||
    !ALLOWED_PROVIDER_AVATAR_HOSTS.has(url.hostname.toLowerCase())
  ) {
    throw new Error('Avatar URL is not from a supported provider.');
  }

  return url;
}

export function getAvatarProviderFromUrl(
  value: string
): 'google' | 'discord' | null {
  try {
    const url = parseProviderAvatarUrl(value);

    return AVATAR_PROVIDER_BY_HOST[url.hostname.toLowerCase()] ?? null;
  } catch {
    return null;
  }
}

async function readLimitedResponseBody(
  response: Response
): Promise<ArrayBuffer> {
  const contentLength = response.headers.get('content-length');

  if (contentLength !== null) {
    const declaredSize = Number(contentLength);

    if (!Number.isSafeInteger(declaredSize) || declaredSize < 0) {
      throw new Error('Invalid avatar image size.');
    }

    if (declaredSize > MAX_AVATAR_SIZE) {
      throw new Error('Avatar image cannot exceed 3 MB.');
    }
  }

  if (!response.body) {
    throw new Error('Provider avatar has no image data.');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalSize = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      totalSize += value.byteLength;

      if (totalSize > MAX_AVATAR_SIZE) {
        await reader.cancel().catch(() => undefined);
        throw new Error('Avatar image cannot exceed 3 MB.');
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const buffer = new ArrayBuffer(totalSize);
  const result = new Uint8Array(buffer);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return buffer;
}

export async function storeAvatarFile(userId: string, file: File) {
  const contentType = normalizeContentType(file.type);
  validateContentType(contentType);

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error('Avatar image cannot exceed 3 MB.');
  }

  const bytes = await file.arrayBuffer();
  validateImageBytes(new Uint8Array(bytes), contentType);

  const extension = EXTENSIONS[contentType];
  const image = new Blob([bytes], { type: contentType });

  const blob = await put(
    `avatars/${userId}/${crypto.randomUUID()}.${extension}`,
    image,
    {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    }
  );

  return blob.url;
}

export async function storeAvatarFromUrl(userId: string, value: string) {
  const url = parseProviderAvatarUrl(value);

  let response: Response;

  try {
    response = await fetch(url, {
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    throw new Error('Unable to securely download the provider avatar.');
  }

  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error('Unable to download the provider avatar.');
  }

  const contentType = normalizeContentType(
    response.headers.get('content-type')
  );

  try {
    validateContentType(contentType);
  } catch (error) {
    await response.body?.cancel().catch(() => undefined);
    throw error;
  }

  const bytes = await readLimitedResponseBody(response);
  validateImageBytes(new Uint8Array(bytes), contentType);

  const extension = EXTENSIONS[contentType];
  const image = new Blob([bytes], { type: contentType });

  const stored = await put(
    `avatars/${userId}/${crypto.randomUUID()}.${extension}`,
    image,
    {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    }
  );

  return stored.url;
}

export async function deleteStoredAvatar(
  url: string | null,
  source: 'default' | 'upload' | 'oauth'
) {
  if (!url || source === 'default') {
    return;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.endsWith('.public.blob.vercel-storage.com')) {
      await del(url);
    }
  } catch {
    // Old/external avatar URLs are intentionally left untouched.
  }
}

export async function deleteStoredAvatarsForUser(userId: string) {
  const prefix = `avatars/${userId}/`;
  let cursor: string | undefined;

  while (true) {
    const result = await list({ prefix, cursor });

    if (result.blobs.length > 0) {
      await del(result.blobs.map((blob) => blob.url));
    }

    if (!result.hasMore) {
      break;
    }

    if (!result.cursor) {
      throw new Error('Could not continue listing avatar blobs.');
    }

    cursor = result.cursor;
  }
}
