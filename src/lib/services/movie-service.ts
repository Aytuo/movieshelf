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

  const source = await movieRepository.getById(tmdbId);

  if (!source) {
    throw new Error('Movie not found.');
  }

  const [created] = await db
    .insert(movie)
    .values({
      id: `tmdb_${source.id}`,
      tmdbId: source.id,
      title: source.title,
      originalTitle: source.originalTitle ?? source.title ?? '',
      overview: source.overview,
      posterPath: source.posterPath,
      backdropPath: source.backdropPath,
      releaseDate: source.releaseDate,
      runtime: source.runtime,
      genres: source.genres,
      tmdbRating: source.rating,
      tmdbVoteCount: source.voteCount,
      tagline: source.tagline,
    })
    .returning();

  return created;
}
