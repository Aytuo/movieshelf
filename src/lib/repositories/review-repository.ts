import { db } from '@/lib/db';
import { media, mediaActivity, profile, review } from '@/lib/db/schema';
import type { ReviewInput } from '@/lib/validations/review';
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
  const [result] = await db
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.mediaId, mediaId)))
    .limit(1);

  return result ?? null;
}

export async function upsertReview({
  userId,
  mediaId,
  input,
  now = new Date(),
}: {
  userId: string;
  mediaId: string;
  input: ReviewInput;
  now?: Date;
}) {
  const [existing] = await db
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.mediaId, mediaId)))
    .limit(1);

  if (existing) {
    const [updated] = await db.batch([
      db
        .update(review)
        .set({
          title: input.title || null,
          content: input.content,
          rating: input.rating,
          containsSpoilers: input.containsSpoilers,
          updatedAt: now,
        })
        .where(eq(review.id, existing.id))
        .returning(),

      db.insert(mediaActivity).values({
        userId,
        mediaId,
        type: 'reviewed',
        reviewId: existing.id,
        createdAt: now,
      }),
    ]);

    return updated[0] ?? null;
  }

  const reviewId = crypto.randomUUID();

  const [created] = await db.batch([
    db
      .insert(review)
      .values({
        id: reviewId,
        userId,
        mediaId,
        title: input.title || null,
        content: input.content,
        rating: input.rating,
        containsSpoilers: input.containsSpoilers,
        createdAt: now,
        updatedAt: now,
      })
      .returning(),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'reviewed',
      reviewId,
      createdAt: now,
    }),
  ]);

  return created[0] ?? null;
}

export async function deleteReview(userId: string, reviewId: string) {
  await db
    .delete(review)
    .where(and(eq(review.id, reviewId), eq(review.userId, userId)));
}
