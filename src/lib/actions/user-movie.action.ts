'use server';

import { requireSession } from '@/lib/auth/require-session';
import { ensureMovieExists } from '@/lib/services/movie-service';
import {
  addToWatchlist,
  markAsWatched,
  removeFromShelf,
  setRating,
  toggleFavorite,
} from '@/lib/services/user-movie-service';
import { revalidatePath } from 'next/cache';

async function getContext(tmdbId: number) {
  const session = await requireSession();

  const movie = await ensureMovieExists(tmdbId);

  return {
    userId: session.user.id,
    movie,
  };
}

export async function addMovieToWatchlist(tmdbId: number) {
  const { userId, movie } = await getContext(tmdbId);

  await addToWatchlist(userId, movie.id);

  revalidatePath('/shelf');
  revalidatePath(`/movie/${tmdbId}`);
}

export async function markMovieAsWatched(tmdbId: number) {
  const { userId, movie } = await getContext(tmdbId);

  await markAsWatched(userId, movie.id);

  revalidatePath('/shelf');
  revalidatePath(`/movie/${tmdbId}`);
}

export async function removeMovieFromShelf(tmdbId: number) {
  const { userId, movie } = await getContext(tmdbId);

  await removeFromShelf(userId, movie.id);

  revalidatePath('/shelf');
  revalidatePath(`/movie/${tmdbId}`);
}

export async function toggleMovieFavorite(tmdbId: number) {
  const { userId, movie } = await getContext(tmdbId);

  await toggleFavorite(userId, movie.id);

  revalidatePath('/shelf');
  revalidatePath(`/movie/${tmdbId}`);
}

export async function rateMovie(tmdbId: number, rating: number) {
  const { userId, movie } = await getContext(tmdbId);

  if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
    throw new Error('Rating must be between 1 and 10.');
  }

  await setRating(userId, movie.id, rating);

  revalidatePath('/shelf');
  revalidatePath(`/movie/${tmdbId}`);
}
