import { db } from '@/lib/db';
import { movie, userMovie } from '@/lib/db/schema';
import {
  RatingDistributionItem,
  TasteDecade,
  TasteGenre,
  TasteProfile,
} from '@/types';
import { desc, eq } from 'drizzle-orm';

function getDecade(releaseDate: string | null) {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  if (!Number.isFinite(year)) {
    return null;
  }

  return `${Math.floor(year / 10) * 10}s`;
}

export async function getTasteProfile(userId: string): Promise<TasteProfile> {
  const shelf = await db
    .select({
      movie,
      shelf: userMovie,
    })
    .from(userMovie)
    .innerJoin(movie, eq(movie.id, userMovie.movieId))
    .where(eq(userMovie.userId, userId))
    .orderBy(desc(userMovie.addedAt));

  const totalMovies = shelf.length;

  const watchedMovies = shelf.filter(({ shelf }) => shelf.status === 'watched');

  const watchlistMovies = shelf.filter(
    ({ shelf }) => shelf.status === 'watchlist'
  );

  const favoriteMovies = shelf.filter(({ shelf }) => shelf.favorite);

  const ratings = watchedMovies
    .map(({ shelf }) => shelf.rating)
    .filter((rating): rating is number => rating !== null);

  const averageRating =
    ratings.length > 0
      ? Number(
          (
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          ).toFixed(1)
        )
      : null;

  /* ------------------------------------------------------------------------ */
  /* Genres                                                                   */
  /* ------------------------------------------------------------------------ */

  const genreCounts = new Map<string, number>();

  for (const { movie } of watchedMovies) {
    for (const genre of movie.genres ?? []) {
      genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
    }
  }

  const totalGenreEntries = Array.from(genreCounts.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  const topGenres: TasteGenre[] = Array.from(genreCounts.entries())
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        totalGenreEntries > 0
          ? Math.round((count / totalGenreEntries) * 100)
          : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  /* ------------------------------------------------------------------------ */
  /* Decades                                                                  */
  /* ------------------------------------------------------------------------ */

  const decadeCounts = new Map<string, number>();

  for (const { movie } of watchedMovies) {
    const decade = getDecade(movie.releaseDate);

    if (!decade) {
      continue;
    }

    decadeCounts.set(decade, (decadeCounts.get(decade) ?? 0) + 1);
  }

  const totalDecadeEntries = watchedMovies.length;

  const favoriteDecades: TasteDecade[] = Array.from(decadeCounts.entries())
    .map(([decade, count]) => ({
      decade,
      count,
      percentage:
        totalDecadeEntries > 0
          ? Math.round((count / totalDecadeEntries) * 100)
          : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  /* ------------------------------------------------------------------------ */
  /* Rating distribution                                                      */
  /* ------------------------------------------------------------------------ */

  const distributionMap = new Map<number, number>();

  for (const rating of ratings) {
    distributionMap.set(rating, (distributionMap.get(rating) ?? 0) + 1);
  }

  const ratingDistribution: RatingDistributionItem[] = Array.from({
    length: 10,
  }).map((_, index) => {
    const rating = index + 1;

    return {
      rating,
      count: distributionMap.get(rating) ?? 0,
    };
  });

  /* ------------------------------------------------------------------------ */
  /* Highest / lowest rated                                                   */
  /* ------------------------------------------------------------------------ */

  const ratedMovies = watchedMovies
    .filter(({ shelf }) => shelf.rating !== null)
    .sort((a, b) => (b.shelf.rating ?? 0) - (a.shelf.rating ?? 0));

  const highestRatedMovies = ratedMovies
    .slice(0, 5)
    .map(({ movie, shelf }) => ({
      id: movie.id,
      tmdbId: movie.tmdbId,
      title: movie.title,
      posterPath: movie.posterPath,
      rating: shelf.rating!,
    }));

  const lowestRatedMovies = [...ratedMovies]
    .reverse()
    .slice(0, 5)
    .map(({ movie, shelf }) => ({
      id: movie.id,
      tmdbId: movie.tmdbId,
      title: movie.title,
      posterPath: movie.posterPath,
      rating: shelf.rating!,
    }));

  return {
    totalMovies,
    watchedMovies: watchedMovies.length,
    watchlistMovies: watchlistMovies.length,
    favoriteMovies: favoriteMovies.length,
    ratedMovies: ratings.length,
    averageRating,
    topGenres,
    favoriteDecades,
    ratingDistribution,
    highestRatedMovies,
    lowestRatedMovies,
  };
}
