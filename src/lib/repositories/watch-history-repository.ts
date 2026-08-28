import { db } from '@/lib/db';
import { movie, watchHistory } from '@/lib/db/schema/tables';
import { and, count, desc, eq } from 'drizzle-orm';

export async function createWatchHistoryEntry({
  userId,
  movieId,
  watchedAt = new Date(),
}: {
  userId: string;
  movieId: string;
  watchedAt?: Date;
}) {
  const [entry] = await db
    .insert(watchHistory)
    .values({
      id: crypto.randomUUID(),
      userId,
      movieId,
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
      movie,
    })
    .from(watchHistory)
    .innerJoin(movie, eq(movie.id, watchHistory.movieId))
    .where(eq(watchHistory.userId, userId))
    .orderBy(desc(watchHistory.watchedAt))
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

export async function getMovieWatchCount({
  userId,
  movieId,
}: {
  userId: string;
  movieId: string;
}) {
  const [result] = await db
    .select({
      count: count(),
    })
    .from(watchHistory)
    .where(
      and(eq(watchHistory.userId, userId), eq(watchHistory.movieId, movieId))
    );

  return result?.count ?? 0;
}
