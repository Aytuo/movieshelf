import {
  createWatchHistoryEntry,
  getMediaWatchCount,
  getWatchHistoryCount,
  getWatchHistoryPage,
} from '@/lib/repositories/watch-history-repository';

export const HISTORY_PAGE_SIZE = 20;

export async function recordWatch(userId: string, mediaId: string) {
  return createWatchHistoryEntry({
    userId,
    mediaId,
  });
}

export async function getUserWatchHistory(userId: string, page = 1) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;

  const offset = (safePage - 1) * HISTORY_PAGE_SIZE;

  const [items, totalResults] = await Promise.all([
    getWatchHistoryPage({
      userId,
      limit: HISTORY_PAGE_SIZE,
      offset,
    }),
    getWatchHistoryCount(userId),
  ]);

  return {
    items,
    page: safePage,
    totalPages: Math.max(1, Math.ceil(totalResults / HISTORY_PAGE_SIZE)),
    totalResults,
  };
}

export async function getWatchHistoryTotal(userId: string) {
  return getWatchHistoryCount(userId);
}

export async function getMediaWatchCountForUser(
  userId: string,
  mediaId: string
) {
  return getMediaWatchCount({
    userId,
    mediaId,
  });
}
