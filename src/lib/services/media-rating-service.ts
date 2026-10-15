import type { Media, MediaKey } from '@/lib/media';
import { getMediaRatingsByTmdbKeys } from '@/lib/repositories';

export type StoredMediaRating = {
  rating: number;
  voteCount: number;
};

export type StoredMediaRatingMap = ReadonlyMap<string, StoredMediaRating>;

export function getMediaKey(media: MediaKey): string {
  return `${media.type}:${media.tmdbId}`;
}

export async function getStoredMediaRatings(
  mediaItems: Media[]
): Promise<StoredMediaRatingMap> {
  if (mediaItems.length === 0) {
    return new Map<string, StoredMediaRating>();
  }

  // Query each unique movie or series only once.
  const uniqueKeys = Array.from(
    new Map(
      mediaItems.map(
        (item) =>
          [
            getMediaKey(item),
            {
              tmdbId: item.tmdbId,
              type: item.type,
            },
          ] as const
      )
    ).values()
  );

  const rows = await getMediaRatingsByTmdbKeys(uniqueKeys);

  return new Map(
    rows.map(
      (row) =>
        [
          getMediaKey(row),
          {
            rating: Number(row.rating ?? 0),
            voteCount: row.voteCount,
          },
        ] as const
    )
  );
}

export function applyStoredMediaRatings<T extends Media>(
  mediaItems: T[],
  storedRatings: StoredMediaRatingMap
): T[] {
  return mediaItems.map((item) => {
    const storedRating = storedRatings.get(getMediaKey(item));

    if (!storedRating) {
      // Preserve the TMDB values for media not stored in our database.
      return item;
    }

    return {
      ...item,
      rating: storedRating.rating,
      voteCount: storedRating.voteCount,
    };
  });
}

export async function withStoredMediaRatings<T extends Media>(
  mediaItems: T[]
): Promise<T[]> {
  const storedRatings = await getStoredMediaRatings(mediaItems);

  return applyStoredMediaRatings(mediaItems, storedRatings);
}
