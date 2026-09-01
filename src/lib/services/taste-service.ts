import { getUserShelf } from '@/lib/repositories/media-interaction-repository';
import type {
  RatingDistributionItem,
  TasteDecade,
  TasteGenre,
  TasteMedia,
  TasteProfile,
  TasteStats,
} from '@/types';

type TasteItem = Awaited<ReturnType<typeof getUserShelf>>[number];

function getDecade(releaseDate: string | null): string | null {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  if (!Number.isFinite(year)) {
    return null;
  }

  return `${Math.floor(year / 10) * 10}s`;
}

function buildTasteStats(items: TasteItem[]): TasteStats {
  const total = items.length;

  const watched = items.filter(
    ({ interaction }) => interaction.status === 'watched'
  );

  const watchlist = items.filter(
    ({ interaction }) => interaction.status === 'watchlist'
  );

  const favorite = items.filter(({ interaction }) => interaction.favorite);

  const ratings = watched
    .map(({ interaction }) => interaction.rating)
    .filter((rating): rating is number => rating !== null);

  const averageRating =
    ratings.length > 0
      ? Number(
          (
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          ).toFixed(1)
        )
      : null;

  /* ========================================================================== */
  /*                                 GENRES                                     */
  /* ========================================================================== */

  const genreCounts = new Map<string, number>();

  for (const { media } of watched) {
    for (const genre of media.genres) {
      genreCounts.set(genre.name, (genreCounts.get(genre.name) ?? 0) + 1);
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

  /* ========================================================================== */
  /*                                 DECADES                                    */
  /* ========================================================================== */

  const decadeCounts = new Map<string, number>();

  for (const { media } of watched) {
    const decade = getDecade(media.releaseDate);

    if (!decade) {
      continue;
    }

    decadeCounts.set(decade, (decadeCounts.get(decade) ?? 0) + 1);
  }

  const totalDecadeEntries = Array.from(decadeCounts.values()).reduce(
    (sum, count) => sum + count,
    0
  );

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

  /* ========================================================================== */
  /*                          RATING DISTRIBUTION                               */
  /* ========================================================================== */

  const distributionMap = new Map<number, number>();

  for (const rating of ratings) {
    distributionMap.set(rating, (distributionMap.get(rating) ?? 0) + 1);
  }

  const ratingDistribution: RatingDistributionItem[] = Array.from(
    { length: 10 },
    (_, index) => {
      const rating = index + 1;

      return {
        rating,
        count: distributionMap.get(rating) ?? 0,
      };
    }
  );

  /* ========================================================================== */
  /*                         HIGHEST / LOWEST RATED                             */
  /* ========================================================================== */

  const rated = watched
    .filter(({ interaction }) => interaction.rating !== null)
    .sort((a, b) => (b.interaction.rating ?? 0) - (a.interaction.rating ?? 0));

  const toTasteMedia = ({ media, interaction }: TasteItem): TasteMedia => ({
    id: media.id,
    tmdbId: media.tmdbId,
    type: media.type,
    title: media.title,
    posterPath: media.posterPath,
    rating: interaction.rating!,
  });

  const highestRated = rated.slice(0, 5).map(toTasteMedia);

  const lowestRated = [...rated].reverse().slice(0, 5).map(toTasteMedia);

  return {
    total,
    watched: watched.length,
    watchlist: watchlist.length,
    favorite: favorite.length,
    rated: ratings.length,
    averageRating,
    topGenres,
    favoriteDecades,
    ratingDistribution,
    highestRated,
    lowestRated,
  };
}

export async function getTasteProfile(userId: string): Promise<TasteProfile> {
  const items = await getUserShelf(userId);

  const movieItems = items.filter(({ media }) => media.type === 'movie');

  const tvItems = items.filter(({ media }) => media.type === 'tv');

  return {
    movie: buildTasteStats(movieItems),
    tv: buildTasteStats(tvItems),
  };
}
