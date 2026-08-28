import { db } from '@/lib/db';
import { movie, userMovie } from '@/lib/db/schema/tables';
import { and, desc, eq } from 'drizzle-orm';

export async function getUserMovieState(userId: string, movieId: string) {
  const result = await db
    .select()
    .from(userMovie)
    .where(and(eq(userMovie.userId, userId), eq(userMovie.movieId, movieId)))
    .limit(1);

  return result[0] ?? null;
}

export async function getUserShelf(userId: string) {
  return db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId))
    .orderBy(desc(userMovie.addedAt));
}

export async function getUserWatchedMovies(userId: string) {
  return db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(and(eq(userMovie.userId, userId), eq(userMovie.status, 'watched')))
    .orderBy(desc(userMovie.watchedAt));
}

export async function getUserWatchlist(userId: string) {
  return db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(and(eq(userMovie.userId, userId), eq(userMovie.status, 'watchlist')))
    .orderBy(desc(userMovie.addedAt));
}

export async function getUserFavorites(userId: string) {
  return db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(and(eq(userMovie.userId, userId), eq(userMovie.favorite, true)))
    .orderBy(desc(userMovie.updatedAt));
}
