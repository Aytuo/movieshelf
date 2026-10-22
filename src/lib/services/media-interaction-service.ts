import {
  addMediaToWatchlist,
  getUserLatestRated,
  getUserMediaInteraction,
  getUserMediaStats,
  getUserShelf as getUserShelfRepository,
  markMediaAsDropped,
  markMediaAsWatched,
  removeMediaFromShelf,
  setMediaRating,
  startMediaWatching,
  toggleMediaFavorite,
} from '@/lib/repositories';
import type { MediaType } from '../media';

export type UserHomeSummary = {
  shelfCount: number;
  watchedCount: number;
  ratedCount: number;
  favoritesCount: number;
  latestRated: {
    tmdbId: number;
    type: MediaType;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    tmdbRating: number | null;
    userRating: number | null;
  }[];
};

/* ========================================================================== */
/*                                GET USER SHELF                              */
/* ========================================================================== */

export async function getUserShelf(userId: string) {
  return getUserShelfRepository(userId);
}

/* ========================================================================== */
/*                             GET USER HOME SUMMARY                          */
/* ========================================================================== */

export async function getUserHomeSummary(
  userId: string
): Promise<UserHomeSummary> {
  const [statsRows, latestRatedRows] = await Promise.all([
    getUserMediaStats(userId),
    getUserLatestRated(userId, 3),
  ]);

  const stats = statsRows.reduce(
    (totals, row) => ({
      shelfCount: totals.shelfCount + Number(row.total),
      watchedCount: totals.watchedCount + Number(row.watched),
      ratedCount: totals.ratedCount + Number(row.rated),
      favoritesCount: totals.favoritesCount + Number(row.favorites),
    }),
    {
      shelfCount: 0,
      watchedCount: 0,
      ratedCount: 0,
      favoritesCount: 0,
    }
  );

  return {
    ...stats,
    latestRated: latestRatedRows.map(({ media, interaction }) => ({
      tmdbId: media.tmdbId,
      type: media.type,
      title: media.title,
      posterPath: media.posterPath,
      releaseDate: media.releaseDate,
      tmdbRating: media.tmdbRating === null ? null : Number(media.tmdbRating),
      userRating: interaction.rating,
    })),
  };
}

/* ========================================================================== */
/*                             GET MEDIA INTERACTION                          */
/* ========================================================================== */

export async function getMediaInteraction(userId: string, mediaId: string) {
  return getUserMediaInteraction(userId, mediaId);
}

/* ========================================================================== */
/*                               ADD TO WATCHLIST                             */
/* ========================================================================== */

export async function addToWatchlist(userId: string, mediaId: string) {
  return addMediaToWatchlist({ userId, mediaId });
}

/* ========================================================================== */
/*                                START WATCHING                              */
/* ========================================================================== */

export async function startWatching(userId: string, mediaId: string) {
  return startMediaWatching({ userId, mediaId });
}

/* ========================================================================== */
/*                               MARK AS WATCHED                              */
/* ========================================================================== */

export async function markAsWatched(userId: string, mediaId: string) {
  return markMediaAsWatched({ userId, mediaId });
}

/* ========================================================================== */
/*                               MARK AS DROPPED                              */
/* ========================================================================== */

export async function markAsDropped(userId: string, mediaId: string) {
  return markMediaAsDropped({ userId, mediaId });
}

/* ========================================================================== */
/*                                  SET RATING                                */
/* ========================================================================== */

export async function setRating(
  userId: string,
  mediaId: string,
  rating: number
) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    throw new Error('Rating must be an integer between 1 and 10.');
  }

  return setMediaRating({
    userId,
    mediaId,
    rating,
  });
}

/* ========================================================================== */
/*                               TOGGLE FAVORITE                              */
/* ========================================================================== */

export async function toggleFavorite(userId: string, mediaId: string) {
  return toggleMediaFavorite({ userId, mediaId });
}

/* ========================================================================== */
/*                              REMOVE FROM SHELF                             */
/* ========================================================================== */

export async function removeFromShelf(userId: string, mediaId: string) {
  return removeMediaFromShelf({ userId, mediaId });
}
