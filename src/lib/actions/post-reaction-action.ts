'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  getPostReactionUsers,
  togglePostReaction,
} from '@/lib/services/post-reaction-service';

export async function togglePostReactionAction(postId: string) {
  const session = await requireSession();

  const result = await togglePostReaction(postId, session.user.id);

  return result;
}

export async function getPostReactionUsersAction(postId: string) {
  await requireSession();

  return getPostReactionUsers(postId);
}
