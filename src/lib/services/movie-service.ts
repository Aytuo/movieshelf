import { db } from '@/lib/db';
import { movie } from '@/lib/db/schema';
import { tmdbMovieRepository } from '@/lib/repositories';
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

  const source = await tmdbMovieRepository.getById(tmdbId);

  if (!source) {
    throw new Error('Movie not found.');
  }

  const [created] = await db
    .insert(movie)
    .values({
      id: `tmdb_${source.tmdbId}`,
      tmdbId: source.tmdbId,
      title: source.title,
      originalTitle: source.originalTitle,
      overview: source.overview,
      posterPath: source.posterPath,
      backdropPath: source.backdropPath,
      releaseDate: source.releaseDate,
      runtime: source.runtime,
      genres: source.genres.map((genre) => genre.name),
      tmdbRating: source.rating,
      tmdbVoteCount: source.voteCount,
      tagline: source.tagline,
    })
    .returning();

  return created;
}
