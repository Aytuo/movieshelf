import {
  createWatchHistoryEntry,
  getMediaWatchCount,
  getWatchHistoryCount,
  getWatchHistoryPage,
} from '@/lib/repositories/watch-history-repository';

export async function recordWatch(userId: string, mediaId: string) {
  return createWatchHistoryEntry({
    userId,
    mediaId,
  });
}

export async function getWatchHistory(
  userId: string,
  options: {
    limit: number;
    offset: number;
  }
) {
  return getWatchHistoryPage({
    userId,
    limit: options.limit,
    offset: options.offset,
  });
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
