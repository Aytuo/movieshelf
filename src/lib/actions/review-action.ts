'use server';

import { requireSession } from '@/lib/auth/require-session';
import type { MediaType } from '@/lib/media';
import { getOrCreateMediaRecord } from '@/lib/services/media-service';
import { deleteReview, upsertReview } from '@/lib/services/review-service';
import { reviewSchema } from '@/lib/validations/review';
import type { ReviewInput } from '@/types';
import { revalidatePath } from 'next/cache';

function getMediaPath(type: MediaType, tmdbId: number) {
  return `/${type === 'movie' ? 'movie' : 'tv'}/${tmdbId}`;
}

export async function saveMediaReview(
  type: MediaType,
  tmdbId: number,
  input: ReviewInput
) {
  const session = await requireSession();

  const parsed = reviewSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid review data.');
  }

  const media = await getOrCreateMediaRecord(type, tmdbId);

  await upsertReview(session.user.id, media.id, parsed.data);

  revalidatePath(getMediaPath(type, tmdbId));
  revalidatePath('/activity');
  revalidatePath('/profile');
}

export async function removeMediaReview(reviewId: string) {
  const session = await requireSession();

  await deleteReview(session.user.id, reviewId);

  revalidatePath('/activity');
}
