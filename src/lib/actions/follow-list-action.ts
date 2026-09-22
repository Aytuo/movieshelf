'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  getUserFollowers,
  getUserFollowing,
} from '@/lib/services/follow-service';

export async function loadFollowersAction(
  profileUserId: string,
  cursor?: string
) {
  const session = await requireSession();

  return getUserFollowers(profileUserId, session.user.id, cursor);
}

export async function loadFollowingAction(
  profileUserId: string,
  cursor?: string
) {
  const session = await requireSession();

  return getUserFollowing(profileUserId, session.user.id, cursor);
}
