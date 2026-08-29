export const DISCOVER_PAGE_SIZE = 24;

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
