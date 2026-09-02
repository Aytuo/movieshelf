import {
  tmdbMovieRepository,
  tmdbSearchRepository,
  tmdbTvRepository,
} from '@/lib/repositories';
import { getSearchPagesNeeded, getSearchSlice } from '@/lib/search/pagination';
import type { SearchFilters } from '@/types';
import { searchPeople } from './people-service';

export async function search({
  query,
  filters,
}: {
  query: string;
  filters: SearchFilters;
}) {
  const normalized = query.trim();
  const page = filters.page ?? 1;

  if (!normalized) {
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

    const totalResults = firstResponse.totalResults;

    const totalPages = firstResponse.totalPages;

    if (totalResults === 0 || page > totalPages) {
      return {
        media: [],
        page,
        totalResults,
        totalPages,
      };
    }

    const pagesNeeded = Math.min(getSearchPagesNeeded(page), totalPages);

    const responses = [
      firstResponse,
      ...(pagesNeeded > 1
        ? await Promise.all(
            Array.from(
              {
                length: pagesNeeded - 1,
              },
              (_, index) =>
                tmdbSearchRepository.search(normalized, {
                  page: index + 2,
                })
            )
          )
        : []),
    ];

    const candidates = responses.flatMap((response) => response.results);

    const { start, end } = getSearchSlice(page);

    return {
      results: candidates.slice(start, end),
      page,
      totalResults,
      totalPages,
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
