'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  createComment,
  getCommentReplies,
  getPostComments,
} from '@/lib/services/comment-service';
import { commentSchema } from '@/lib/validations/comment';
import type { CommentInput } from '@/types';
import { revalidatePath } from 'next/cache';

export async function saveComment(input: CommentInput) {
  const session = await requireSession();

  const parsed = commentSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid comment data.');
  }

  const created = await createComment(session.user.id, parsed.data);

  if (!created) {
    throw new Error('Unable to create comment.');
  }

  revalidatePath(`/posts/${created.postId}`);

  return created;
}

export async function loadPostComments(postId: string) {
  const session = await requireSession();

  if (!session.user.id) {
    throw new Error('Unauthorized.');
  }

  return getPostComments(postId, session.user.id);
}

export async function loadCommentReplies(postId: string, parentId: string) {
  const session = await requireSession();

  if (!session.user.id) {
    throw new Error('Unauthorized.');
  }

  return getCommentReplies(parentId, postId, session.user.id);
}
