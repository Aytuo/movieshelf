'use server';

import { requireSession } from '@/lib/auth/require-session';
import { ensureMovieExists } from '@/lib/services/movie-service';
import { deleteReview, upsertReview } from '@/lib/services/review-service';
import { reviewSchema, type ReviewInput } from '@/lib/validations/review';
import { revalidatePath } from 'next/cache';

export async function saveMovieReview(tmdbId: number, input: ReviewInput) {
  const session = await requireSession();
  const parsed = reviewSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid review data.');
  }

  const movie = await ensureMovieExists(tmdbId);

  await upsertReview(session.user.id, movie.id, parsed.data);

  revalidatePath(`/movie/${tmdbId}`);
  revalidatePath(`/profile/${session.user.id}`);
}

export async function removeMovieReview(reviewId: string) {
  const session = await requireSession();

  await deleteReview(session.user.id, reviewId);

  revalidatePath('/home');
}
