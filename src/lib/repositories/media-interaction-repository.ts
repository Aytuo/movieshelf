import { db } from '@/lib/db';
import { media, mediaInteraction } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function getUserMediaInteraction(userId: string, mediaId: string) {
  const result = await db
    .select()
    .from(mediaInteraction)
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.mediaId, mediaId)
      )
    )
    .limit(1);

  return result[0] ?? null;
}

export async function getUserShelf(userId: string) {
  return db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(eq(mediaInteraction.userId, userId))
    .orderBy(desc(mediaInteraction.createdAt));
}

export async function getUserWatchedMedia(userId: string) {
  return db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.status, 'watched')
      )
    )
    .orderBy(desc(mediaInteraction.watchedAt));
}

export async function getUserWatchlist(userId: string) {
  return db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.status, 'watchlist')
      )
    )
    .orderBy(desc(mediaInteraction.createdAt));
}

export async function getUserFavorites(userId: string) {
  return db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.favorite, true)
      )
    )
    .orderBy(desc(mediaInteraction.updatedAt));
}
