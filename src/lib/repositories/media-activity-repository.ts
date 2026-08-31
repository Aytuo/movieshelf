import { db } from '@/lib/db';
import {
  media,
  mediaActivity,
  MediaActivityType,
  review,
} from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function createMediaActivity({
  userId,
  mediaId,
  type,
  rating,
  reviewId,
  createdAt = new Date(),
}: {
  userId: string;
  mediaId: string;
  type: MediaActivityType;
  rating?: number;
  reviewId?: string;
  createdAt?: Date;
}) {
  const [activity] = await db
    .insert(mediaActivity)
    .values({
      userId,
      mediaId,
      type,
      rating: rating ?? null,
      reviewId: reviewId ?? null,
      createdAt,
    })
    .returning();

  return activity;
}

export async function getUserMediaActivity(userId: string) {
  return db
    .select({
      activity: mediaActivity,
      media,
      review,
    })
    .from(mediaActivity)
    .innerJoin(media, eq(media.id, mediaActivity.mediaId))
    .leftJoin(review, eq(review.id, mediaActivity.reviewId))
    .where(eq(mediaActivity.userId, userId))
    .orderBy(desc(mediaActivity.createdAt))
    .limit(100);
}
