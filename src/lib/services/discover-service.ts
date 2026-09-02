import { DISCOVER_PAGE_SIZE } from '@/lib/discover/pagination';
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

async function discoverMedia(filters: DiscoverFilters, maxResults: number) {
  switch (filters.type) {
    case 'movie':
      return tmdbMovieRepository.discover(filters, {
        maxResults,
      });

    case 'tv':
      return tmdbTvRepository.discover(filters, {
        maxResults,
      });
  }
}

export async function discoverForUser(
  userId: string,
  filters: DiscoverFilters
) {
  const page = filters.page ?? 1;

  // We request enough candidates to build the requested application page after removing media already present on the user's shelf.

  const requiredCount = page * DISCOVER_PAGE_SIZE;

  // Known media.

  const knownMedia = filters.hideOnShelf ? await getUserMediaKeys(userId) : [];

  const knownMediaKeys = new Set(knownMedia.map(getMediaKey));

  // Fetch candidates.

  let result = await discoverMedia(filters, requiredCount);

  const filterKnownMedia = (items: Media[]) =>
    items.filter((item) => !knownMediaKeys.has(getMediaKey(item)));

  let filtered = filterKnownMedia(result.media);

  // Fetch additional candidates.

  while (
    filters.hideOnShelf &&
    filtered.length < requiredCount &&
    result.media.length < 200 &&
    result.media.length < result.totalResults
  ) {
    const nextCandidateCount = result.media.length + DISCOVER_PAGE_SIZE;

    result = await discoverMedia(filters, nextCandidateCount);

    filtered = filterKnownMedia(result.media);
  }

  // Application pagination.

  const start = (page - 1) * DISCOVER_PAGE_SIZE;
  const end = start + DISCOVER_PAGE_SIZE;

  return {
    ...result,
    media: filtered.slice(start, end),
  };
}
