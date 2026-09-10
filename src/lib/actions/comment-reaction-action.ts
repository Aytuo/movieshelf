'use server';

import { revalidatePath } from 'next/cache';
import { requireSession } from '../auth/require-session';
import { toggleCommentReaction } from '../services/comment-reaction-service';

export async function toggleCommentReactionAction(
  commentId: string,
  postId: string
) {
  const session = await requireSession();

  const result = await toggleCommentReaction(commentId, session.user.id);

  revalidatePath(`/posts/${postId}`);

  return result;
}
