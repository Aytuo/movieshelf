import {
  getMediaForRatingRefresh,
  markMediaRatingChecked,
  updateMediaTmdbRating,
} from '@/lib/repositories';
import { getMovieRating } from '@/lib/tmdb/movie-api';
import { getTvRating } from '@/lib/tmdb/tv-api';

const RATING_REFRESH_BATCH_SIZE = 25;
const RATING_REFRESH_CONCURRENCY = 5;

export async function refreshMediaRatings() {
  const items = await getMediaForRatingRefresh(RATING_REFRESH_BATCH_SIZE);

  let updated = 0;
  let failed = 0;

  for (
    let start = 0;
    start < items.length;
    start += RATING_REFRESH_CONCURRENCY
  ) {
    const batch = items.slice(start, start + RATING_REFRESH_CONCURRENCY);

    await Promise.all(
      batch.map(async (item) => {
        try {
          const result =
            item.type === 'movie'
              ? await getMovieRating(item.tmdbId)
              : await getTvRating(item.tmdbId);

          await updateMediaTmdbRating(item.id, result.rating, result.voteCount);

          updated += 1;
        } catch (error) {
          failed += 1;

          console.error(
            `[media-rating-sync] Failed: ${item.type}:${item.tmdbId}`,
            error
          );

          try {
            await markMediaRatingChecked(item.id);
          } catch (markError) {
            console.error(
              `[media-rating-sync] Could not mark checked: ${item.type}:${item.tmdbId}`,
              markError
            );
          }
        }
      })
    );
  }

  return {
    processed: items.length,
    updated,
    failed,
  };
}
