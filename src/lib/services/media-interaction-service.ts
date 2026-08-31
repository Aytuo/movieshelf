import { getUserShelf as getUserShelfRepository } from '@/lib/repositories';
import {
  addMediaToWatchlist,
  getUserMediaInteraction,
  markMediaAsDropped,
  markMediaAsWatched,
  removeMediaFromShelf,
  setMediaRating,
  startMediaWatching,
  toggleMediaFavorite,
} from '@/lib/repositories/media-interaction-repository';

/* ========================================================================== */
/*                                GET USER SHELF                              */
/* ========================================================================== */

export async function getUserShelf(userId: string) {
  return getUserShelfRepository(userId);
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
  if (rating < 1 || rating > 10) {
    throw new Error('Rating must be between 1 and 10.');
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
