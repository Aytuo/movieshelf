export const DISCOVER_PAGE_SIZE = 20;
export const TMDB_DISCOVER_PAGE_SIZE = 20;
export const TMDB_DISCOVER_MAX_PAGES = 500;

export function getReachableDiscoverResultCount(
  totalResults: number,
  totalTmdbPages: number
) {
  const safeTotalResults = Number.isFinite(totalResults)
    ? Math.max(0, Math.floor(totalResults))
    : 0;

  const safeTotalPages = Number.isFinite(totalTmdbPages)
    ? Math.max(0, Math.floor(totalTmdbPages))
    : 0;

  return Math.min(
    safeTotalResults,
    safeTotalPages * TMDB_DISCOVER_PAGE_SIZE,
    TMDB_DISCOVER_MAX_PAGES * TMDB_DISCOVER_PAGE_SIZE
  );
}

export function getReachableDiscoverPageCount(
  totalResults: number,
  totalTmdbPages: number
) {
  return Math.max(
    1,
    Math.ceil(
      getReachableDiscoverResultCount(totalResults, totalTmdbPages) /
        DISCOVER_PAGE_SIZE
    )
  );
}

export function getRequiredMediaCount(appPage: number) {
  return appPage * DISCOVER_PAGE_SIZE;
}

export function getDiscoverSlice(appPage: number) {
  const start = (appPage - 1) * DISCOVER_PAGE_SIZE;

  return {
    start,
    end: start + DISCOVER_PAGE_SIZE,
  };
}
