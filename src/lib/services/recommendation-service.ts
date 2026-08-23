import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { movie, userMovie } from '../db/schema';
import { generateCandidates } from '../recommendations/candidate-generator';
import { diversifyRecommendations } from '../recommendations/diversify';
import { excludeKnownMovies } from '../recommendations/exclusions';
import { buildTasteSignals, scoreCandidate } from '../recommendations/scorer';

export async function getRecommendationsForUser(
  userId: string
): Promise<MovieRecommendation[]> {
  const shelf = await db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId))
    .orderBy(desc(userMovie.updatedAt));

  const knownTmdbIds = new Set(shelf.map(({ movie }) => movie.tmdbId));

  const ratedMovies = shelf
    .filter(({ shelf }) => shelf.rating !== null)
    .map(({ movie, shelf }) => ({
      movie: {
        id: movie.tmdbId,
        title: movie.title,
        originalTitle: movie.originalTitle,
        overview: movie.overview ?? '',
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate ?? '',
        runtime: movie.runtime,
        genres: movie.genres ?? [],
        rating: Number(movie.tmdbRating ?? 0),
        voteCount: movie.tmdbVoteCount ?? 0,
      },

      rating: Number(shelf.rating),
    }))
    .sort((a, b) => b.rating - a.rating);

  /*
   * Cold start.
   *
   * We need at least a few strong signals before trying
   * to personalize aggressively.
   */
  if (ratedMovies.length < 3) {
    return [];
  }

  const seeds = ratedMovies
    .filter(({ rating }) => rating >= 8)
    .slice(0, 3)
    .map(({ movie, rating }) => ({
      tmdbId: movie.id,
      rating,
    }));

  if (seeds.length === 0) {
    return [];
  }

  const signals = buildTasteSignals(ratedMovies);

  const candidates = await generateCandidates(seeds);

  const seedTitles = new Map(
    seeds.map((seed) => [
      seed.tmdbId,
      ratedMovies.find(({ movie }) => movie.id === seed.tmdbId)?.movie.title,
    ])
  );

  const scored = candidates.map((candidate) =>
    scoreCandidate({
      candidate,
      signals,
      sourceMovieTitle: seedTitles.get(candidate.sourceMovieId ?? -1),
    })
  );

  const filtered = excludeKnownMovies(scored, knownTmdbIds);

  return diversifyRecommendations(filtered, 12);
}
