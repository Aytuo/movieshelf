'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  createComment,
  deleteComment,
  getCommentReplies,
  getPostComments,
  updateComment,
} from '@/lib/services/comment-service';
import {
  commentSchema,
  deleteCommentSchema,
  editCommentSchema,
} from '@/lib/validations/comment';
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

export async function loadPostComments(postId: string, cursor?: string) {
  const session = await requireSession();

  if (!session.user.id) {
    throw new Error('Unauthorized.');
  }

  return getPostComments(postId, session.user.id, cursor, 10);
}

export async function loadCommentReplies(postId: string, parentId: string) {
  const session = await requireSession();

  if (!session.user.id) {
    throw new Error('Unauthorized.');
  }

  return getCommentReplies(parentId, postId, session.user.id);
}

export async function editCommentAction(input: {
  commentId: string;
  content: string;
}) {
  const session = await requireSession();

  const parsed = editCommentSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid comment data.');
  }

  const updated = await updateComment(
    session.user.id,
    parsed.data.commentId,
    parsed.data.content
  );

  if (!updated) {
    throw new Error('Unable to edit comment.');
  }

  return updated;
}

export async function deleteCommentAction(input: { commentId: string }) {
  const session = await requireSession();

  const parsed = deleteCommentSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid comment data.');
  }

  const deleted = await deleteComment(session.user.id, parsed.data.commentId);

  if (!deleted) {
    throw new Error('Unable to delete comment.');
  }

  return deleted;
}
