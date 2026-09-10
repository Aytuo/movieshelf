'use server';

import { requireSession } from '@/lib/auth/require-session';
import { toggleCommentReaction } from '@/lib/services/comment-reaction-service';
import { revalidatePath } from 'next/cache';

export async function toggleCommentReactionAction(
  commentId: string,
  postId: string
) {
  const session = await requireSession();

  const result = await toggleCommentReaction(commentId, session.user.id);

  revalidatePath(`/posts/${postId}`);

  return result;
}
