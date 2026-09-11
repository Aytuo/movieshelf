'use server';

import { requireSession } from '@/lib/auth/require-session';
import { getOrCreateMediaRecord } from '@/lib/services/media-service';
import { createPost, getMediaPosts } from '@/lib/services/post-service';
import { postSchema } from '@/lib/validations/post';
import type { PostInput } from '@/types';
import { revalidatePath } from 'next/cache';

function getMediaPath(type: PostInput['type'], tmdbId: number) {
  return `/${type === 'movie' ? 'movie' : 'tv'}/${tmdbId}`;
}

export async function savePost(input: PostInput) {
  const session = await requireSession();

  const parsed = postSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid post data.');
  }

  const media = await getOrCreateMediaRecord(
    parsed.data.type,
    parsed.data.tmdbId
  );

  const post = await createPost(session.user.id, media.id, parsed.data);

  if (!post) {
    throw new Error('Unable to create post.');
  }

  revalidatePath(getMediaPath(parsed.data.type, parsed.data.tmdbId));
  revalidatePath('/activity');
  revalidatePath('/profile');

  return post;
}

export async function loadMoreMediaPosts(
  type: PostInput['type'],
  tmdbId: number,
  cursor: string
) {
  const session = await requireSession();

  if (!session.user.id) {
    throw new Error('Unauthorized.');
  }

  if (!cursor) {
    throw new Error('Invalid cursor.');
  }

  const media = await getOrCreateMediaRecord(type, tmdbId);

  return getMediaPosts(media.id, session.user.id, {
    limit: 5,
    cursor,
  });
}
