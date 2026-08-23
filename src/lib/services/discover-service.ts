import { db } from '@/lib/db';
import { movie, userMovie } from '@/lib/db/schema';
import { movieRepository } from '@/lib/repositories';
import { eq } from 'drizzle-orm';

export async function discoverForUser(
  userId: string,
  filters: DiscoverFilters
) {
  const result = await movieRepository.discover(filters);

  const existing = await db
    .select({
      tmdbId: movie.tmdbId,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId));

  const knownIds = new Set(existing.map((item) => item.tmdbId));

  const movies = result.movies.filter((movie) => !knownIds.has(movie.id));

  return {
    ...result,
    movies,
  };
}
