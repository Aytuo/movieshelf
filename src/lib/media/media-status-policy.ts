import type { MediaDetails } from '@/lib/media';

export type ShelfMediaStatus = 'watchlist' | 'watching' | 'watched';

function getTodayDateString(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isMediaReleased(media: MediaDetails): boolean {
  if (!media.releaseDate) {
    return false;
  }

  return media.releaseDate <= getTodayDateString();
}

export function getAllowedMediaStatuses(
  media: MediaDetails
): ShelfMediaStatus[] {
  if (!isMediaReleased(media)) {
    return ['watchlist'];
  }

  return ['watchlist', 'watching', 'watched'];
}

export function canStartWatching(media: MediaDetails): boolean {
  return isMediaReleased(media);
}

export function canMarkAsWatched(media: MediaDetails): boolean {
  return isMediaReleased(media);
}
