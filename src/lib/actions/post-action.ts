'use server';

import { requireSession } from '@/lib/auth/require-session';
import { createPost } from '@/lib/services/post-service';
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

  const post = await createPost(session.user.id, parsed.data);

  if (!post) {
    throw new Error('Unable to create post.');
  }

  revalidatePath(getMediaPath(parsed.data.type, parsed.data.tmdbId));
  revalidatePath('/activity');
  revalidatePath('/profile');

  return post;
}
