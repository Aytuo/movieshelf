import type { Media } from '@/lib/media';
import {
  getUserMediaKeys,
  tmdbMovieRepository,
  tmdbTvRepository,
} from '@/lib/repositories';
import type { DiscoverFilters } from '@/types';

function getMediaKey(media: Pick<Media, 'tmdbId' | 'type'>) {
  return `${media.type}:${media.tmdbId}`;
}

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
  if (!filters.hideOnShelf) {
    return discoverMedia(filters);
  }

  // We retrieve only the results for the current page and the shelf keys.
  const [result, knownMedia] = await Promise.all([
    discoverMedia(filters),
    getUserMediaKeys(userId),
  ]);

  const knownMediaKeys = new Set(knownMedia.map(getMediaKey));

  // We filter only the current TMDB page.
  const media = result.media.filter(
    (item) => !knownMediaKeys.has(getMediaKey(item))
  );

  return {
    ...result,
    media,
    // Excluding the shelf, the exact number of pages is unknown.
    totalPagesKnown: false,
    // The next TMDB page may contain further results.
    canGoNext: result.page < result.totalPages,
  };
}
