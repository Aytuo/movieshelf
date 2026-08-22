import { db } from '@/lib/db';
import { movie, userMovie } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export async function addMovieToShelf({ userId, movieId }: AddMovieInput) {
  await db
    .insert(userMovie)
    .values({
      userId,
      movieId,
      status: 'watchlist',
    })
    .onConflictDoNothing();
}

export async function removeMovieFromShelf({ userId, movieId }: AddMovieInput) {
  await db
    .delete(userMovie)
    .where(and(eq(userMovie.userId, userId), eq(userMovie.movieId, movieId)));
}

export async function isMovieOnShelf({ userId, movieId }: AddMovieInput) {
  const result = await db
    .select({
      movieId: userMovie.movieId,
    })
    .from(userMovie)
    .where(and(eq(userMovie.userId, userId), eq(userMovie.movieId, movieId)))
    .limit(1);

  return result.length > 0;
}

export async function getUserShelf(userId: string) {
  return db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId));
}
