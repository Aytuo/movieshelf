'use server';

import { requireSession } from '@/lib/auth/require-session';
import { toggleCommentReaction } from '@/lib/services/comment-reaction-service';

export async function toggleCommentReactionAction(commentId: string) {
  const session = await requireSession();

  return toggleCommentReaction(commentId, session.user.id);
}
