import { db } from '@/lib/db';
import type { ReviewInput } from '@/lib/validations/review';
import { and, eq } from 'drizzle-orm';
import { review } from '../db/schema/tables';

export async function upsertReview(
  userId: string,
  movieId: string,
  input: ReviewInput
) {
  const existing = await db
    .select()
    .from(review)
    .where(and(eq(review.userId, userId), eq(review.movieId, movieId)))
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
      movieId,
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
