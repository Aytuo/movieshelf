import { db } from '@/lib/db';
import { media, watchHistory } from '@/lib/db/schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';

export async function createWatchHistoryEntry({
  userId,
  mediaId,
  watchedAt = new Date(),
}: {
  userId: string;
  mediaId: string;
  watchedAt?: Date;
}) {
  const [entry] = await db
    .insert(watchHistory)
    .values({
      userId,
      mediaId,
      watchedAt,
    })
    .returning();

  return entry;
}

export async function getWatchHistoryPage({
  userId,
  limit,
  offset,
}: {
  userId: string;
  limit: number;
  offset: number;
}) {
  return db
    .select({
      history: watchHistory,
      media,

      // Number of this particular watch for the user/media pair; We number watches chronologically: 1 = first watch, 2 = first re-watch, 3 = second etc.

      watchNumber: sql<number>`
        row_number() over (
          partition by
            ${watchHistory.userId},
            ${watchHistory.mediaId}
          order by
            ${watchHistory.watchedAt} asc,
            ${watchHistory.createdAt} asc,
            ${watchHistory.id} asc
        )::int
      `,
    })
    .from(watchHistory)
    .innerJoin(media, eq(media.id, watchHistory.mediaId))
    .where(eq(watchHistory.userId, userId))
    .orderBy(desc(watchHistory.watchedAt), desc(watchHistory.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getWatchHistoryCount(userId: string) {
  const [result] = await db
    .select({
      count: count(),
    })
    .from(watchHistory)
    .where(eq(watchHistory.userId, userId));

  return result?.count ?? 0;
}

export async function getMediaWatchCount({
  userId,
  mediaId,
}: {
  userId: string;
  mediaId: string;
}) {
  const [result] = await db
    .select({
      count: count(),
    })
    .from(watchHistory)
    .where(
      and(eq(watchHistory.userId, userId), eq(watchHistory.mediaId, mediaId))
    );

  return result?.count ?? 0;
}
