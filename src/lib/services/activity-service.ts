import { db } from '@/lib/db';
import { movie, review, userMovie, watchHistory } from '@/lib/db/schema/tables';
import { desc, eq } from 'drizzle-orm';

export type ActivityItem =
  | {
      type: 'watched';
      id: string;
      createdAt: Date;
      movie: typeof movie.$inferSelect;
      watchedAt: Date;
    }
  | {
      type: 'review';
      id: string;
      createdAt: Date;
      movie: typeof movie.$inferSelect;
      review: typeof review.$inferSelect;
    }
  | {
      type: 'shelf';
      id: string;
      createdAt: Date;
      movie: typeof movie.$inferSelect;
      shelf: typeof userMovie.$inferSelect;
    };

export async function getUserActivity(userId: string) {
  const [watches, reviews, shelves] = await Promise.all([
    db
      .select({
        history: watchHistory,
        movie,
      })
      .from(watchHistory)
      .innerJoin(movie, eq(movie.id, watchHistory.movieId))
      .where(eq(watchHistory.userId, userId))
      .orderBy(desc(watchHistory.watchedAt))
      .limit(50),

    db
      .select({
        review,
        movie,
      })
      .from(review)
      .innerJoin(movie, eq(movie.id, review.movieId))
      .where(eq(review.userId, userId))
      .orderBy(desc(review.createdAt))
      .limit(50),

    db
      .select({
        shelf: userMovie,
        movie,
      })
      .from(userMovie)
      .innerJoin(movie, eq(movie.id, userMovie.movieId))
      .where(eq(userMovie.userId, userId))
      .orderBy(desc(userMovie.updatedAt))
      .limit(50),
  ]);

  return [
    ...watches.map(({ history, movie }) => ({
      type: 'watched' as const,
      id: history.id,
      createdAt: history.watchedAt,
      movie,
      watchedAt: history.watchedAt,
    })),

    ...reviews.map(({ review, movie }) => ({
      type: 'review' as const,
      id: review.id,
      createdAt: review.createdAt,
      movie,
      review,
    })),

    ...shelves.map(({ shelf, movie }) => ({
      type: 'shelf' as const,
      id: `${shelf.userId}:${shelf.movieId}`,
      createdAt: shelf.updatedAt,
      movie,
      shelf,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
