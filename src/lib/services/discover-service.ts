import {
  getUserMediaKeys,
  getUserWatchedOrRatedMediaKeys,
  tmdbMovieRepository,
  tmdbTvRepository,
} from '@/lib/repositories';
import type { DiscoverFilters, DiscoverMedia } from '@/types';
import { getMediaKey, withStoredMediaRatings } from './media-rating-service';

async function discoverMedia(filters: DiscoverFilters) {
  switch (filters.type) {
    case 'movie':
      return tmdbMovieRepository.discover(filters);

    case 'tv':
      return tmdbTvRepository.discover(filters);
  }
}

export async function discoverForUser(
  userId: string,
  filters: DiscoverFilters
) {
  const [result, knownMedia] = await Promise.all([
    discoverMedia(filters),
    filters.hideOnShelf ? getUserMediaKeys(userId) : Promise.resolve([]),
  ]);

  const [watchedOrRatedMedia, ratedMedia] = await Promise.all([
    getUserWatchedOrRatedMediaKeys(userId, result.media),
    withStoredMediaRatings(result.media),
  ]);

  const watchedOrRatedKeys = new Set(watchedOrRatedMedia.map(getMediaKey));

  const media: DiscoverMedia[] = ratedMedia.map((item) => ({
    ...item,
    userHasWatchedOrRated: watchedOrRatedKeys.has(getMediaKey(item)),
  }));

  if (!filters.hideOnShelf) {
    return {
      ...result,
      media,
      emptyAfterShelfFilter: false,
    };
  }

  const knownMediaKeys = new Set(knownMedia.map(getMediaKey));

  const filteredMedia = media.filter(
    (item) => !knownMediaKeys.has(getMediaKey(item))
  );

  return {
    ...result,
    media: filteredMedia,
    emptyAfterShelfFilter:
      result.media.length > 0 && filteredMedia.length === 0,
    totalPagesKnown: false,
    canGoNext: result.page < result.totalPages,
  };
}
