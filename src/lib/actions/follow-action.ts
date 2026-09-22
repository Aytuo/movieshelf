'use server';

import { requireSession } from '@/lib/auth/require-session';
import { followUser, unfollowUser } from '@/lib/services/follow-service';
import { notifyUserFollow } from '@/lib/services/notification-service';
import { revalidatePath } from 'next/cache';

function revalidateProfile() {
  revalidatePath('/profile/[username]', 'page');
}

export async function followUserAction(followingId: string): Promise<boolean> {
  const session = await requireSession();

  const created = await followUser(session.user.id, followingId);

  if (!created) {
    return false;
  }

  try {
    await notifyUserFollow(session.user.id, followingId);
  } catch (error) {
    console.error('Failed to create follow notification:', error);
  }

  revalidateProfile();

  return true;
}

export async function unfollowUserAction(
  followingId: string
): Promise<boolean> {
  const session = await requireSession();

  const deleted = await unfollowUser(session.user.id, followingId);

  if (deleted) {
    revalidateProfile();
  }

  return deleted;
}
