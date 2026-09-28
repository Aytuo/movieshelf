import { del, put } from '@vercel/blob';

export const MAX_AVATAR_SIZE = 3 * 1024 * 1024;

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

function validateImage(contentType: string, size: number) {
  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    throw new Error('Unsupported image format.');
  }

  if (size > MAX_AVATAR_SIZE) {
    throw new Error('Avatar image cannot exceed 3 MB.');
  }
}

export async function storeAvatarFile(userId: string, file: File) {
  validateImage(file.type, file.size);

  const extension = EXTENSIONS[file.type];

  const blob = await put(
    `avatars/${userId}/${crypto.randomUUID()}.${extension}`,
    file,
    {
      access: 'public',
      contentType: file.type,
      addRandomSuffix: false,
    }
  );

  return blob.url;
}

export async function storeAvatarFromUrl(userId: string, url: string) {
  const parsed = new URL(url);

  if (parsed.protocol !== 'https:') {
    throw new Error('Avatar URL must use HTTPS.');
  }

  const response = await fetch(parsed, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Unable to download the provider avatar.');
  }

  const contentType = response.headers.get('content-type')?.split(';')[0] ?? '';

  const blob = await response.blob();

  validateImage(contentType, blob.size);

  const extension = EXTENSIONS[contentType];

  const stored = await put(
    `avatars/${userId}/${crypto.randomUUID()}.${extension}`,
    blob,
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
