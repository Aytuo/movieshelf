import { db } from '@/lib/db';
import { media, watchHistory } from '@/lib/db/schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';

type DbMedia = typeof media.$inferSelect;
type DbWatchHistory = typeof watchHistory.$inferSelect;

type CreateWatchHistoryEntryData = {
  userId: string;
  mediaId: string;
  watchedAt?: Date;
};

type GetWatchHistoryPageData = {
  userId: string;
  limit: number;
  offset: number;
};

type WatchHistoryRow = {
  history: DbWatchHistory;
  media: DbMedia;
  watchNumber: number;
};

type GetMediaWatchCountData = {
  userId: string;
  mediaId: string;
};

export async function createWatchHistoryEntry({
  userId,
  mediaId,
  watchedAt = new Date(),
}: CreateWatchHistoryEntryData) {
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
}: GetWatchHistoryPageData): Promise<WatchHistoryRow[]> {
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

export async function getWatchHistoryCount(userId: string): Promise<number> {
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
}: GetMediaWatchCountData): Promise<number> {
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
