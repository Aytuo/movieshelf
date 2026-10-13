import type { TmdbPagedResponse } from '@/lib/tmdb/types';

export const SEARCH_PAGE_SIZE = 20;
export const TMDB_SEARCH_MAX_PAGES = 500;

export function getSearchPagination(
  totalResults: number,
  tmdbTotalPages: number,
  requestedPage: number
) {
  const safeTotalResults = Number.isFinite(totalResults)
    ? Math.max(0, Math.floor(totalResults))
    : 0;

  const safeTmdbTotalPages = Number.isFinite(tmdbTotalPages)
    ? Math.max(0, Math.floor(tmdbTotalPages))
    : 0;

  const calculatedPages = Math.ceil(safeTotalResults / SEARCH_PAGE_SIZE);

  const reachablePages =
    safeTotalResults === 0
      ? 0
      : Math.min(
          TMDB_SEARCH_MAX_PAGES,
          calculatedPages,
          safeTmdbTotalPages || calculatedPages
        );

  const totalPages = Math.max(1, reachablePages);

  const reachableResults = Math.min(
    safeTotalResults,
    reachablePages * SEARCH_PAGE_SIZE
  );

  const safeRequestedPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return {
    page: Math.min(safeRequestedPage, totalPages),
    totalPages,
    totalResults: reachableResults,
  };
}

export async function paginateSearchItems<TResult>(
  requestedPage: number,
  fetchPage: (tmdbPage: number) => Promise<TmdbPagedResponse<TResult>>
) {
  // The first response establishes stable pagination metadata.
  const firstResponse = await fetchPage(1);

  const pagination = getSearchPagination(
    firstResponse.total_results,
    firstResponse.total_pages,
    requestedPage
  );

  if (pagination.totalResults === 0) {
    return {
      items: [],
      ...pagination,
    };
  }

  // We retrieve only the current page, without merging previous pages.
  const response =
    pagination.page === 1 ? firstResponse : await fetchPage(pagination.page);

  return {
    items: response.results.slice(0, SEARCH_PAGE_SIZE),
    ...pagination,
  };
}
