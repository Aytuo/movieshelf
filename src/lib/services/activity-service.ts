import { db } from '@/lib/db';
import { movie, review, userMovie } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export type ShelfActivity = {
  type: 'shelf';
  movie: typeof movie.$inferSelect;
  shelf: typeof userMovie.$inferSelect;
};

export type ReviewActivity = {
  type: 'review';
  review: typeof review.$inferSelect;
  movie: typeof movie.$inferSelect;
};

export async function getUserActivity(userId: string) {
  const shelfRows = await db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId))
    .orderBy(desc(userMovie.updatedAt))
    .limit(10);

  const reviewRows = await db
    .select({
      review,
      movie,
    })
    .from(review)
    .innerJoin(movie, eq(movie.id, review.movieId))
    .where(eq(review.userId, userId))
    .orderBy(desc(review.createdAt))
    .limit(10);

  const shelfActivity: ShelfActivity[] = shelfRows.map((row) => ({
    type: 'shelf',
    ...row,
  }));

  const reviewActivity: ReviewActivity[] = reviewRows.map((row) => ({
    type: 'review',
    ...row,
  }));

  return {
    shelfActivity,
    reviewActivity,
  };
}
