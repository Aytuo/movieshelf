import type { TmdbPagedResponse } from '@/lib/tmdb/types';

const SEARCH_PAGE_SIZE = 24;
const TMDB_PAGE_SIZE = 20;

export function getSearchTotalPages(totalResults: number) {
  return Math.max(1, Math.ceil(totalResults / SEARCH_PAGE_SIZE));
}

export function getSearchPagesNeeded(appPage: number) {
  return Math.ceil((appPage * SEARCH_PAGE_SIZE) / TMDB_PAGE_SIZE);
}

export function getSearchSlice(appPage: number) {
  const start = (appPage - 1) * SEARCH_PAGE_SIZE;

  return {
    start,
    end: start + SEARCH_PAGE_SIZE,
  };
}

export async function paginateSearchResults<TResult>(
  appPage: number,
  fetchPage: (tmdbPage: number) => Promise<TmdbPagedResponse<TResult>>
) {
  const firstResponse = await fetchPage(1);

  const totalResults = firstResponse.total_results;

  const totalPages = getSearchTotalPages(totalResults);

  if (totalResults === 0 || appPage > totalPages) {
    return {
      media: [],
      page: appPage,
      totalResults,
      totalPages,
    };
  }

  const pagesNeeded = getSearchPagesNeeded(appPage);

  const responses = [
    firstResponse,
    ...(pagesNeeded > 1
      ? await Promise.all(
          Array.from(
            {
              length: pagesNeeded - 1,
            },
            (_, index) => fetchPage(index + 2)
          )
        )
      : []),
  ];

  const candidates = responses.flatMap((response) => response.results);

  const { start, end } = getSearchSlice(appPage);

  return {
    media: candidates.slice(start, end),
    page: appPage,
    totalResults,
    totalPages,
  };
}
