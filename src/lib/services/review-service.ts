import {
  deleteReview as deleteReviewRepository,
  upsertReview as upsertReviewRepository,
} from '@/lib/repositories/review-repository';
import type { ReviewInput } from '@/types';

export async function upsertReview(
  userId: string,
  mediaId: string,
  input: ReviewInput
) {
  return upsertReviewRepository({
    userId,
    mediaId,
    input,
  });
}

export async function deleteReview(userId: string, reviewId: string) {
  return deleteReviewRepository(userId, reviewId);
}
