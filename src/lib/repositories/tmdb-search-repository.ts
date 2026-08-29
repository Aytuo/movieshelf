import { mapTmdbMultiSearchResult } from '@/lib/tmdb/mapper';
import { Media } from '../media';
import { searchMulti } from '../tmdb/search-api';
import type { SearchRepository } from './types';

function isMedia(
  item: ReturnType<typeof mapTmdbMultiSearchResult>
): item is Media {
  return item !== null;
}

export const tmdbSearchRepository: SearchRepository = {
  async search(query, options) {
    const page = options?.page ?? 1;

    const response = await searchMulti(query, page);

    const media = response.results
      .map(mapTmdbMultiSearchResult)
      .filter(isMedia);

    return {
      media,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  },
};
