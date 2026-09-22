import {
  createFollow,
  deleteFollow,
  getFollowers,
  getFollowing,
  getFollowStats,
  getProfileByUsername,
  isFollowing,
} from '@/lib/repositories';
import type { FollowStats, FollowUserPage } from '@/types';

export type FollowListMode = 'followers' | 'following';

export async function followUser(
  followerId: string,
  followingId: string
): Promise<boolean> {
  if (followerId === followingId) {
    throw new Error('You cannot follow yourself.');
  }

  return createFollow(followerId, followingId);
}

export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<boolean> {
  if (followerId === followingId) {
    throw new Error('You cannot unfollow yourself.');
  }

  return deleteFollow(followerId, followingId);
}

export async function checkFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  return isFollowing(followerId, followingId);
}

export async function getUserFollowStats(
  profileUserId: string,
  viewerUserId: string
): Promise<FollowStats> {
  return getFollowStats(profileUserId, viewerUserId);
}

export async function getUserFollowers(
  profileUserId: string,
  viewerUserId: string,
  cursor?: string
): Promise<FollowUserPage> {
  return getFollowers(profileUserId, viewerUserId, cursor, 20);
}

export async function getUserFollowing(
  profileUserId: string,
  viewerUserId: string,
  cursor?: string
): Promise<FollowUserPage> {
  return getFollowing(profileUserId, viewerUserId, cursor, 20);
}

export async function getFollowListData(
  username: string,
  viewerUserId: string,
  mode: FollowListMode
) {
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return null;
  }

  const initialPage =
    mode === 'followers'
      ? await getUserFollowers(profile.userId, viewerUserId)
      : await getUserFollowing(profile.userId, viewerUserId);

  return {
    profile,
    initialPage,
  };
}
