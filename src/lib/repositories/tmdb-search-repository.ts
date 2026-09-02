import { searchMulti } from '@/lib/tmdb/search-api';
import {
  mapTmdbMultiSearchResult,
  type MappedMultiSearchResult,
} from '@/lib/tmdb/search-mapper';
import type { SearchAllItem, SearchAllResult } from '@/types';
import type { SearchRepository } from './types';

function mapSearchResult(item: MappedMultiSearchResult): SearchAllItem {
  if (item.type === 'media') {
    return {
      type: 'media',
      media: item.data,
    };
  }

  return {
    type: 'person',
    person: item.data,
  };
}

export const tmdbSearchRepository: SearchRepository = {
  async search(query, options): Promise<SearchAllResult> {
    const page = options?.page ?? 1;

    const response = await searchMulti(query, page);

    const results = response.results
      .map(mapTmdbMultiSearchResult)
      .map(mapSearchResult);

    return {
      results,
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  },
};
