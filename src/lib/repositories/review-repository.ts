import { db } from '@/lib/db';
import { media, profile, review } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function getMediaReviews(mediaId: string) {
  return db
    .select({
      review,
      profile,
    })
    .from(review)
    .innerJoin(profile, eq(profile.userId, review.userId))
    .where(eq(review.mediaId, mediaId))
    .orderBy(desc(review.createdAt));
}

export async function getUserReviews(userId: string) {
  return db
    .select({
      review,
      media,
    })
    .from(review)
    .innerJoin(media, eq(media.id, review.mediaId))
    .where(eq(review.userId, userId))
    .orderBy(desc(review.createdAt));
}

export async function getUserReviewForMedia(userId: string, mediaId: string) {
  const result = await db
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.mediaId, mediaId)))
    .limit(1);

  return result[0] ?? null;
}
