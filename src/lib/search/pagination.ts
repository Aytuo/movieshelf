export const SEARCH_PAGE_SIZE = 24;
const TMDB_PAGE_SIZE = 20;

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
