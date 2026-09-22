import { db } from '@/lib/db';
import { userFollow } from '@/lib/db/schema';
import type { FollowStats } from '@/types';
import { and, eq } from 'drizzle-orm';

export async function isFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const [row] = await db
    .select({
      followerId: userFollow.followerId,
    })
    .from(userFollow)
    .where(
      and(
        eq(userFollow.followerId, followerId),
        eq(userFollow.followingId, followingId)
      )
    )
    .limit(1);

  return Boolean(row);
}

export async function createFollow(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const [created] = await db
    .insert(userFollow)
    .values({
      followerId,
      followingId,
    })
    .onConflictDoNothing()
    .returning({
      followerId: userFollow.followerId,
    });

  return Boolean(created);
}

export async function deleteFollow(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const [deleted] = await db
    .delete(userFollow)
    .where(
      and(
        eq(userFollow.followerId, followerId),
        eq(userFollow.followingId, followingId)
      )
    )
    .returning({
      followerId: userFollow.followerId,
    });

  return Boolean(deleted);
}

export async function getFollowStats(
  profileUserId: string,
  viewerUserId: string
): Promise<FollowStats> {
  const [followerCount, followingCount, viewerIsFollowing] = await Promise.all([
    db.$count(userFollow, eq(userFollow.followingId, profileUserId)),

    db.$count(userFollow, eq(userFollow.followerId, profileUserId)),

    isFollowing(viewerUserId, profileUserId),
  ]);

  return {
    followerCount,
    followingCount,
    viewerIsFollowing,
  };
}
