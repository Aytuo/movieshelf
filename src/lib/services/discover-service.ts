import { db } from '@/lib/db';
import { movie, userMovie } from '@/lib/db/schema';
import { DISCOVER_PAGE_SIZE } from '@/lib/discover/pagination';
import { MovieDiscoverFilters } from '@/types';
import { eq } from 'drizzle-orm';
import { tmdbMovieRepository } from '../repositories';

export async function discoverForUser(
  userId: string,
  filters: MovieDiscoverFilters
) {
  const page = filters.page ?? 1;

  const requiredCount = page * DISCOVER_PAGE_SIZE;

  const existing = filters.hideOnShelf
    ? await db
        .select({
          tmdbId: movie.tmdbId,
        })
        .from(userMovie)
        .innerJoin(movie, eq(movie.id, userMovie.movieId))
        .where(eq(userMovie.userId, userId))
    : [];

  const knownIds = new Set(existing.map((item) => item.tmdbId));

  let result = await tmdbMovieRepository.discover(filters, {
    maxMovies: requiredCount,
  });

  let filtered = result.movies.filter((item) => !knownIds.has(item.tmdbId));

  while (
    filters.hideOnShelf &&
    filtered.length < requiredCount &&
    result.movies.length < 200
  ) {
    const nextCandidateCount = result.movies.length + DISCOVER_PAGE_SIZE;

    result = await tmdbMovieRepository.discover(filters, {
      maxMovies: nextCandidateCount,
    });

    filtered = result.movies.filter((item) => !knownIds.has(item.tmdbId));

    if (result.movies.length >= result.totalResults) {
      break;
    }
  }

  const start = (page - 1) * DISCOVER_PAGE_SIZE;

  const end = start + DISCOVER_PAGE_SIZE;

  return {
    ...result,
    movies: filtered.slice(start, end),
  };
}
