import {
  DISCOVER_PAGE_SIZE,
  getDiscoverSlice,
  getRequiredMediaCount,
  TMDB_DISCOVER_MAX_PAGES,
} from '@/lib/discover/pagination';
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

async function discoverMedia(filters: DiscoverFilters, maxResults?: number) {
  const options = maxResults === undefined ? undefined : { maxResults };

  switch (filters.type) {
    case 'movie':
      return tmdbMovieRepository.discover(filters, options);

    case 'tv':
      return tmdbTvRepository.discover(filters, options);
  }
}

export async function discoverForUser(
  userId: string,
  filters: DiscoverFilters
) {
  // Standard mode does not require downloading previous pages.
  if (!filters.hideOnShelf) {
    return discoverMedia(filters);
  }

  const requestedPage = filters.page ?? 1;

  const knownMedia = await getUserMediaKeys(userId);

  const knownMediaKeys = new Set(knownMedia.map(getMediaKey));

  // Any item from the pool of a given type may potentially require replacement by an additional candidate.
  const knownMediaCount = knownMedia.filter(
    (item) => item.type === filters.type
  ).length;

  const maxCandidates = TMDB_DISCOVER_MAX_PAGES * DISCOVER_PAGE_SIZE;

  const requestedCount = Math.min(
    maxCandidates,
    getRequiredMediaCount(requestedPage) + knownMediaCount
  );

  const result = await discoverMedia(filters, requestedCount);

  const filtered = result.media.filter(
    (item) => !knownMediaKeys.has(getMediaKey(item))
  );

  // We know that the entire reachable set has been retrieved if:
  // - the number of elements has reached the number of candidates, or
  // - the API did not provide as many candidates as we requested.
  const allCandidatesLoaded =
    result.media.length < requestedCount ||
    result.media.length >= result.totalResults;

  const totalPages = allCandidatesLoaded
    ? Math.max(1, Math.ceil(filtered.length / DISCOVER_PAGE_SIZE))
    : result.totalPages;

  const page = Math.min(requestedPage, totalPages);

  const { start } = getDiscoverSlice(page);

  return {
    ...result,
    page,
    totalPages,
    media: filtered.slice(start, start + DISCOVER_PAGE_SIZE),
  };
}
