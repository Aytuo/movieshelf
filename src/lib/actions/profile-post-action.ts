'use server';

import { requireSession } from '@/lib/auth/require-session';
import { getPublicPosts } from '@/lib/services/profile-service';

export async function loadProfilePostsAction(
  username: string,
  cursor?: string
) {
  const session = await requireSession();

  return getPublicPosts(username, session.user.id, {
    cursor,
    limit: 5,
  });
}
