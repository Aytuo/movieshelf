import {
  getWatchHistoryCount,
  getWatchHistoryPage,
} from '@/lib/repositories/watch-history-repository';

const WATCH_HISTORY_PAGE_SIZE = 24;

export async function getUserWatchHistory(userId: string, page = 1) {
  const currentPage = Math.max(1, Math.floor(page));

  const offset = (currentPage - 1) * WATCH_HISTORY_PAGE_SIZE;

  const [items, totalResults] = await Promise.all([
    getWatchHistoryPage({
      userId,
      limit: WATCH_HISTORY_PAGE_SIZE,
      offset,
    }),

    getWatchHistoryCount(userId),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalResults / WATCH_HISTORY_PAGE_SIZE)
  );

  return {
    items,
    page: currentPage,
    totalResults,
    totalPages,
  };
}

export function getWatchLabel(watchNumber: number) {
  return watchNumber === 1 ? 'First watch' : `Rewatch #${watchNumber}`;
}
