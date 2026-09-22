import {
  createFollow,
  deleteFollow,
  getFollowStats,
  isFollowing,
} from '@/lib/repositories/follow-repository';
import type { FollowStats } from '@/types';

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
