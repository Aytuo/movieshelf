export const DISCOVER_PAGE_SIZE = 24;

export function getRequiredMovieCount(appPage: number) {
  return appPage * DISCOVER_PAGE_SIZE;
}

export function getAppPageSlice(appPage: number) {
  const start = (appPage - 1) * DISCOVER_PAGE_SIZE;

  const end = start + DISCOVER_PAGE_SIZE;

  return {
    start,
    end,
  };
}
