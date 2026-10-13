import {
  tmdbMovieRepository,
  tmdbSearchRepository,
  tmdbTvRepository,
} from '@/lib/repositories';
import type { SearchFilters, SearchResult } from '@/types';
import { getSearchPagination, SEARCH_PAGE_SIZE } from '../search/pagination';
import { normalizeSearchQuery } from '../search/query';
import { searchPeople } from './people-service';

export async function search({
  query,
  filters,
}: {
  query: string;
  filters: SearchFilters;
}): Promise<SearchResult> {
  const normalized = normalizeSearchQuery(query);
  const page = filters.page ?? 1;

  if (!normalized) {
    if (filters.type === 'all') {
      return {
        results: [],
        page: 1,
        totalResults: 0,
        totalPages: 0,
      };
    }

    if (filters.type === 'person') {
      return {
        people: [],
        page: 1,
        totalResults: 0,
        totalPages: 0,
      };
    }

    return {
      media: [],
      page: 1,
      totalResults: 0,
      totalPages: 0,
    };
  }

  // Global search: CTRL+K and /search?type=all use TMDB multi-search endpoint; results contain both Movie and TV.

  if (filters.type === 'all') {
    const firstResponse = await tmdbSearchRepository.search(normalized, {
      page: 1,
    });

    const pagination = getSearchPagination(
      firstResponse.totalResults,
      firstResponse.totalPages,
      page
    );

    if (pagination.totalResults === 0) {
      return {
        results: [],
        ...pagination,
      };
    }

    const response =
      pagination.page === 1
        ? firstResponse
        : await tmdbSearchRepository.search(normalized, {
            page: pagination.page,
          });

    return {
      results: response.results.slice(0, SEARCH_PAGE_SIZE),
      ...pagination,
    };
  }

  if (filters.type === 'person') {
    return searchPeople(normalized, page);
  }

  // Type-specific search: /search?type=movie AND /search?type=tv; the selected repository is responsible for translating the application-level year filter to the correct TMDB parameter.

  const repository =
    filters.type === 'movie' ? tmdbMovieRepository : tmdbTvRepository;

  const response = await repository.search(normalized, {
    page,
    year: filters.year,
  });

  return response;
}
