'use server';

import { requireSession } from '@/lib/auth/require-session';
import type { MediaType } from '@/lib/media';
import {
  addToWatchlist,
  markAsWatched,
  removeFromShelf,
  setRating,
  toggleFavorite,
} from '@/lib/services/media-interaction-service';
import { getOrCreateMediaRecord } from '@/lib/services/media-service';
import { revalidatePath } from 'next/cache';

async function getContext(type: MediaType, tmdbId: number) {
  const session = await requireSession();

  const media = await getOrCreateMediaRecord(type, tmdbId);

  return {
    userId: session.user.id,
    media,
  };
}

export async function addMediaToWatchlist(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await addToWatchlist(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(`/media/${type}/${tmdbId}`);
}

export async function markMediaAsWatched(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await markAsWatched(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath('/history');
  revalidatePath('/activity');
  revalidatePath(`/media/${type}/${tmdbId}`);
}

export async function removeMediaFromShelf(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await removeFromShelf(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(`/media/${type}/${tmdbId}`);
}

export async function toggleMediaFavorite(type: MediaType, tmdbId: number) {
  const { userId, media } = await getContext(type, tmdbId);

  await toggleFavorite(userId, media.id);

  revalidatePath('/shelf');
  revalidatePath(`/media/${type}/${tmdbId}`);
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

  await setRating(userId, media.id, rating);

  revalidatePath('/shelf');
  revalidatePath(`/media/${type}/${tmdbId}`);
}
