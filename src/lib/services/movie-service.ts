import { db } from '@/lib/db';
import { movie } from '@/lib/db/schema';
import { movieRepository } from '@/lib/repositories';
import { eq } from 'drizzle-orm';

export async function ensureMovieExists(tmdbId: number) {
  const existing = await db
    .select()
    .from(movie)
    .where(eq(movie.tmdbId, tmdbId))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const sourceMovie = await movieRepository.getById(tmdbId);

  if (!sourceMovie) {
    throw new Error('Movie not found.');
  }

  const [createdMovie] = await db
    .insert(movie)
    .values({
      id: `tmdb_${sourceMovie.id}`,
      tmdbId: sourceMovie.id,
      title: sourceMovie.title,
      originalTitle: sourceMovie.originalTitle ?? sourceMovie.title ?? '',
      overview: sourceMovie.overview,
      posterPath: sourceMovie.posterPath,
      backdropPath: sourceMovie.backdropPath,
      releaseDate: sourceMovie.releaseDate,
      runtime: sourceMovie.runtime,
      genres: sourceMovie.genres,
      rating: sourceMovie.rating.toFixed(1),
      voteCount: sourceMovie.voteCount,
      tagline: sourceMovie.tagline,
    })
    .returning();

  return createdMovie;
}
