import { db } from '@/lib/db';
import { movie, profile, review } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function getMovieReviews(movieId: string) {
  return db
    .select({
      review,
      profile,
    })
    .from(review)
    .innerJoin(profile, eq(profile.userId, review.userId))
    .where(eq(review.movieId, movieId))
    .orderBy(desc(review.createdAt));
}

export async function getUserReviews(userId: string) {
  return db
    .select({
      review,
      movie,
    })
    .from(review)
    .innerJoin(movie, eq(movie.id, review.movieId))
    .where(eq(review.userId, userId))
    .orderBy(desc(review.createdAt));
}

export async function getUserReviewForMovie(userId: string, movieId: string) {
  const result = await db
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.movieId, movieId)))
    .limit(1);

  return result[0] ?? null;
}
