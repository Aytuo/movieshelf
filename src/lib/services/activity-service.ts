import { db } from '@/lib/db';
import { media, mediaInteraction, review, watchHistory } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export type ActivityItem =
  | {
      type: 'watched';
      id: string;
      createdAt: Date;
      media: typeof media.$inferSelect;
      watchedAt: Date;
    }
  | {
      type: 'review';
      id: string;
      createdAt: Date;
      media: typeof media.$inferSelect;
      review: typeof review.$inferSelect;
    }
  | {
      type: 'shelf';
      id: string;
      createdAt: Date;
      media: typeof media.$inferSelect;
      interaction: typeof mediaInteraction.$inferSelect;
    };

export async function getUserActivity(userId: string): Promise<ActivityItem[]> {
  const [watches, reviews, shelves] = await Promise.all([
    db
      .select({
        history: watchHistory,
        media,
      })
      .from(watchHistory)
      .innerJoin(media, eq(media.id, watchHistory.mediaId))
      .where(eq(watchHistory.userId, userId))
      .orderBy(desc(watchHistory.watchedAt))
      .limit(50),

    db
      .select({
        review,
        media,
      })
      .from(review)
      .innerJoin(media, eq(media.id, review.mediaId))
      .where(eq(review.userId, userId))
      .orderBy(desc(review.createdAt))
      .limit(50),

    db
      .select({
        interaction: mediaInteraction,
        media,
      })
      .from(mediaInteraction)
      .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
      .where(eq(mediaInteraction.userId, userId))
      .orderBy(desc(mediaInteraction.updatedAt))
      .limit(50),
  ]);

  return [
    ...watches.map(({ history, media }) => ({
      type: 'watched' as const,
      id: history.id,
      createdAt: history.watchedAt,
      media,
      watchedAt: history.watchedAt,
    })),

    ...reviews.map(({ review, media }) => ({
      type: 'review' as const,
      id: review.id,
      createdAt: review.createdAt,
      media,
      review,
    })),

    ...shelves.map(({ interaction, media }) => ({
      type: 'shelf' as const,
      id: `${interaction.userId}:${interaction.mediaId}`,
      createdAt: interaction.updatedAt,
      media,
      interaction,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
