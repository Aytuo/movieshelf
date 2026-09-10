'use server';

import { requireSession } from '@/lib/auth/require-session';
import { togglePostReaction } from '@/lib/services/post-reaction-service';

export async function togglePostReactionAction(postId: string) {
  const session = await requireSession();

  const result = await togglePostReaction(postId, session.user.id);

  return result;
}
