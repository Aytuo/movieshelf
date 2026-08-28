import { MediaRecommendation } from '@/types';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { movie, userMovie } from '../db/schema/tables';
import { generateCandidates } from '../recommendations/candidate-generator';
import { diversifyRecommendations } from '../recommendations/diversify';
import { excludeKnownMovies } from '../recommendations/exclusions';
import { buildTasteSignals, scoreCandidate } from '../recommendations/scorer';

export async function getRecommendationsForUser(
  userId: string
): Promise<MediaRecommendation[]> {
  const shelf = await db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId))
    .orderBy(desc(userMovie.updatedAt));

  // Known movies: The database is still movie-only, so the user's shelf gives us the collection of TMDB movie IDs that should be excluded from recommendations.

  const knownTmdbIds = new Set(shelf.map(({ movie }) => movie.tmdbId));

  // Rated movies: The DB schema remains movie-only, but the recommendation engine works with the new Media model.

  const ratedMovies = shelf
    .filter(({ shelf }) => shelf.rating !== null)
    .map(({ movie, shelf }) => ({
      media: {
        tmdbId: movie.tmdbId,
        type: 'movie' as const,
        title: movie.title,
        originalTitle: movie.originalTitle,
        overview: movie.overview ?? '',
        posterPath: movie.posterPath,
        backdropPath: movie.backdropPath,
        releaseDate: movie.releaseDate ?? null,
        rating: Number(movie.tmdbRating ?? 0),
        voteCount: movie.tmdbVoteCount ?? 0,
        originalLanguage: movie.originalLanguage ?? '',
        genres: (movie.genres ?? []).map((genre) => ({
          id: genre.id,
          name: genre.name,
        })),
      },
      rating: Number(shelf.rating),
    }))
    .sort((a, b) => b.rating - a.rating);

  //  Cold start:We need at least a few strong signals before trying to personalize aggressively.

  if (ratedMovies.length < 3) {
    return [];
  }

  // Recommendation seeds: Only strongly-rated movies are used as sources for personalized recommendations.

  const seeds = ratedMovies
    .filter(({ rating }) => rating >= 8)
    .slice(0, 3)
    .map(({ media, rating }) => ({
      tmdbId: media.tmdbId,
      rating,
    }));

  if (seeds.length === 0) {
    return [];
  }

  // Taste signals: These are used to score candidates.

  const signals = buildTasteSignals(ratedMovies);

  // Candidate generation: We generate candidates for each seed movie.

  const candidates = await generateCandidates(seeds);

  // Source movie titles: These are used to provide context to the user.

  const seedTitles = new Map<number, string>();
  for (const seed of seeds) {
    const ratedMovie = ratedMovies.find(
      ({ media }) => media.tmdbId === seed.tmdbId
    );
    if (ratedMovie) {
      seedTitles.set(seed.tmdbId, ratedMovie.media.title);
    }
  }

  // Scoring: We score the candidates.

  const scored = candidates.map((candidate) =>
    scoreCandidate({
      candidate,
      signals,
      sourceMovieTitle: seedTitles.get(candidate.sourceMovieId ?? -1),
    })
  );

  // Exclusions: We exclude known movies.

  const filtered = excludeKnownMovies(scored, knownTmdbIds);

  // Diversification: We diversify the recommendations.

  return diversifyRecommendations(filtered, 12);
}
