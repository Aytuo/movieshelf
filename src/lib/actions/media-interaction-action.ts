'use server';

import { requireSession } from '@/lib/auth/require-session';
import type { MediaType } from '@/lib/media';
import {
  addToWatchlist,
  markAsDropped,
  markAsWatched,
  removeFromShelf,
  setRating,
  startWatching,
  toggleFavorite,
} from '@/lib/services/media-interaction-service';
import {
  getMediaDetails,
  getOrCreateMediaRecord,
} from '@/lib/services/media-service';
import { revalidatePath } from 'next/cache';
import {
  canMarkAsWatched,
  canStartWatching,
} from '../media/media-status-policy';

async function getContext(type: MediaType, tmdbId: number) {
  const session = await requireSession();

  const media = await getOrCreateMediaRecord(type, tmdbId);

  return {
    userId: session.user.id,
    media,
  };
}

function getMediaPath(type: MediaType, tmdbId: number) {
  return `/${type === 'movie' ? 'movie' : 'tv'}/${tmdbId}`;
}

export async function addMediaToWatchlist(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await addToWatchlist(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(getMediaPath(type, tmdbId));
}

export async function startMediaWatching(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);
  const details = await getMediaDetails(type, tmdbId);

  if (!canStartWatching(details)) {
    throw new Error('This media has not been released yet.');
  }

  await startWatching(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(getMediaPath(type, tmdbId));
}

export async function markMediaAsWatched(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);
  const details = await getMediaDetails(type, tmdbId);

  if (!canMarkAsWatched(details)) {
    throw new Error('This media has not been released yet.');
  }

  const watchNumber = await markAsWatched(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath('/history');
  revalidatePath('/activity');
  revalidatePath(getMediaPath(type, tmdbId));

  return watchNumber;
}

export async function markMediaAsDropped(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await markAsDropped(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(getMediaPath(type, tmdbId));
}

export async function removeMediaFromShelf(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await removeFromShelf(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(getMediaPath(type, tmdbId));
}

export async function toggleMediaFavorite(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await toggleFavorite(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(getMediaPath(type, tmdbId));
}

export async function rateMedia(
  type: MediaType,
  tmdbId: number,
  rating: number
) {
  const { userId, media } = await getContext(type, tmdbId);

  if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
    throw new Error('Rating must be between 1 and 10.');
  }

  const details = await getMediaDetails(type, tmdbId);

  if (!canMarkAsWatched(details)) {
    throw new Error('This media has not been released yet.');
  }

  await setRating(userId, media.id, rating);

  revalidatePath('/shelf');
  revalidatePath('/activity');
  revalidatePath(getMediaPath(type, tmdbId));
}
