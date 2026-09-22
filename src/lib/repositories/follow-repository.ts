import { db } from '@/lib/db';
import { profile, userFollow } from '@/lib/db/schema';
import type { FollowStats, FollowUser, FollowUserPage } from '@/types';
import { and, desc, eq, inArray, lt, or } from 'drizzle-orm';

function encodeFollowCursor(createdAt: Date, userId: string) {
  return Buffer.from(
    JSON.stringify({
      createdAt: createdAt.toISOString(),
      userId,
    }),
    'utf8'
  ).toString('base64url');
}

function decodeFollowCursor(cursor: string) {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8')
    ) as {
      createdAt?: string;
      userId?: string;
    };

    if (!parsed.createdAt || !parsed.userId) {
      return null;
    }

    const createdAt = new Date(parsed.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return {
      createdAt,
      userId: parsed.userId,
    };
  } catch {
    return null;
  }
}

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

export async function getFollowers(
  profileUserId: string,
  viewerUserId: string,
  cursor?: string,
  limit = 20
): Promise<FollowUserPage> {
  const decodedCursor = cursor ? decodeFollowCursor(cursor) : null;

  const conditions = [eq(userFollow.followingId, profileUserId)];

  if (decodedCursor) {
    const cursorCondition = or(
      lt(userFollow.createdAt, decodedCursor.createdAt),
      and(
        eq(userFollow.createdAt, decodedCursor.createdAt),
        lt(userFollow.followerId, decodedCursor.userId)
      )
    );

    if (cursorCondition) {
      conditions.push(cursorCondition);
    }
  }

  const rows = await db
    .select({
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      createdAt: userFollow.createdAt,
    })
    .from(userFollow)
    .innerJoin(profile, eq(profile.userId, userFollow.followerId))
    .where(and(...conditions))
    .orderBy(desc(userFollow.createdAt), desc(userFollow.followerId))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  const userIds = pageRows.map((row) => row.userId);

  const followingRows =
    userIds.length > 0
      ? await db
          .select({
            followingId: userFollow.followingId,
          })
          .from(userFollow)
          .where(
            and(
              eq(userFollow.followerId, viewerUserId),
              inArray(userFollow.followingId, userIds)
            )
          )
      : [];

  const followingSet = new Set(followingRows.map((row) => row.followingId));

  const users: FollowUser[] = pageRows.map((row) => ({
    userId: row.userId,
    username: row.username,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    viewerIsFollowing: followingSet.has(row.userId),
  }));

  const lastRow = pageRows.at(-1);

  return {
    users,
    nextCursor:
      hasMore && lastRow
        ? encodeFollowCursor(lastRow.createdAt, lastRow.userId)
        : null,
    hasMore,
  };
}

export async function getFollowing(
  profileUserId: string,
  viewerUserId: string,
  cursor?: string,
  limit = 20
): Promise<FollowUserPage> {
  const decodedCursor = cursor ? decodeFollowCursor(cursor) : null;

  const conditions = [eq(userFollow.followerId, profileUserId)];

  if (decodedCursor) {
    const cursorCondition = or(
      lt(userFollow.createdAt, decodedCursor.createdAt),
      and(
        eq(userFollow.createdAt, decodedCursor.createdAt),
        lt(userFollow.followingId, decodedCursor.userId)
      )
    );

    if (cursorCondition) {
      conditions.push(cursorCondition);
    }
  }

  const rows = await db
    .select({
      userId: profile.userId,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      createdAt: userFollow.createdAt,
    })
    .from(userFollow)
    .innerJoin(profile, eq(profile.userId, userFollow.followingId))
    .where(and(...conditions))
    .orderBy(desc(userFollow.createdAt), desc(userFollow.followingId))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  const userIds = pageRows.map((row) => row.userId);

  const followingRows =
    userIds.length > 0
      ? await db
          .select({
            followingId: userFollow.followingId,
          })
          .from(userFollow)
          .where(
            and(
              eq(userFollow.followerId, viewerUserId),
              inArray(userFollow.followingId, userIds)
            )
          )
      : [];

  const followingSet = new Set(followingRows.map((row) => row.followingId));

  const users: FollowUser[] = pageRows.map((row) => ({
    userId: row.userId,
    username: row.username,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    viewerIsFollowing: followingSet.has(row.userId),
  }));

  const lastRow = pageRows.at(-1);

  return {
    users,
    nextCursor:
      hasMore && lastRow
        ? encodeFollowCursor(lastRow.createdAt, lastRow.userId)
        : null,
    hasMore,
  };
}
