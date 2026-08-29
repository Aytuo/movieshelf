import { db } from '@/lib/db';
import { review } from '@/lib/db/schema';
import type { ReviewInput } from '@/lib/validations/review';
import { and, eq } from 'drizzle-orm';

export async function upsertReview(
  userId: string,
  mediaId: string,
  input: ReviewInput
) {
  const existing = await db
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.mediaId, mediaId)))
    .limit(1);

  if (existing[0]) {
    const [updated] = await db
      .update(review)
      .set({
        title: input.title || null,
        content: input.content,
        rating: input.rating,
        containsSpoilers: input.containsSpoilers,
        updatedAt: new Date(),
      })
      .where(eq(review.id, existing[0].id))
      .returning();

    return updated;
  }

  const [created] = await db
    .insert(review)
    .values({
      userId,
      mediaId,
      title: input.title || null,
      content: input.content,
      rating: input.rating,
      containsSpoilers: input.containsSpoilers,
    })
    .returning();

  return created;
}

export async function deleteReview(userId: string, reviewId: string) {
  await db
    .delete(review)
    .where(and(eq(review.id, reviewId), eq(review.userId, userId)));
}
