import { db } from '@/lib/db';
import { mediaInteraction, watchHistory } from '@/lib/db/schema';
import { getUserShelf as getUserShelfRepository } from '@/lib/repositories';
import { and, eq } from 'drizzle-orm';

/* ========================================================================== */
/*                                GET USER SHELF                              */
/* ========================================================================== */

export async function getUserShelf(userId: string) {
  return getUserShelfRepository(userId);
}

/* ========================================================================== */
/*                               ADD TO WATCHLIST                             */
/* ========================================================================== */

export async function addToWatchlist(userId: string, mediaId: string) {
  const now = new Date();

  await db
    .insert(mediaInteraction)
    .values({
      userId,
      mediaId,
      status: 'watchlist',
      favorite: false,
      rating: null,
      watchedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [mediaInteraction.userId, mediaInteraction.mediaId],
      set: {
        status: 'watchlist',
        updatedAt: now,
      },
    });
}

/* ========================================================================== */
/*                                START WATCHING                              */
/* ========================================================================== */

export async function startWatching(userId: string, mediaId: string) {
  const now = new Date();

  await db
    .insert(mediaInteraction)
    .values({
      userId,
      mediaId,
      status: 'watching',
      favorite: false,
      rating: null,
      watchedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [mediaInteraction.userId, mediaInteraction.mediaId],
      set: {
        status: 'watching',
        updatedAt: now,
      },
    });
}

/* ========================================================================== */
/*                               MARK AS WATCHED                              */
/* ========================================================================== */

export async function markAsWatched(userId: string, mediaId: string) {
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx
      .insert(mediaInteraction)
      .values({
        userId,
        mediaId,
        status: 'watched',
        favorite: false,
        rating: null,
        watchedAt: now,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [mediaInteraction.userId, mediaInteraction.mediaId],
        set: {
          status: 'watched',
          watchedAt: now,
          updatedAt: now,
        },
      });

    await tx.insert(watchHistory).values({
      userId,
      mediaId,
      watchedAt: now,
      createdAt: now,
    });
  });
}

/* ========================================================================== */
/*                               MARK AS DROPPED                              */
/* ========================================================================== */

export async function markAsDropped(userId: string, mediaId: string) {
  const now = new Date();

  await db
    .insert(mediaInteraction)
    .values({
      userId,
      mediaId,
      status: 'dropped',
      favorite: false,
      rating: null,
      watchedAt: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [mediaInteraction.userId, mediaInteraction.mediaId],
      set: {
        status: 'dropped',
        updatedAt: now,
      },
    });
}

/* ========================================================================== */
/*                                  SET RATING                                */
/* ========================================================================== */

export async function setRating(
  userId: string,
  mediaId: string,
  rating: number
) {
  if (rating < 1 || rating > 10) {
    throw new Error('Rating must be between 1 and 10.');
  }

  const now = new Date();

  await db
    .insert(mediaInteraction)
    .values({
      userId,
      mediaId,
      status: 'watched',
      rating,
      favorite: false,
      watchedAt: now,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [mediaInteraction.userId, mediaInteraction.mediaId],
      set: {
        rating,
        status: 'watched',
        watchedAt: now,
        updatedAt: now,
      },
    });
}

/* ========================================================================== */
/*                               TOGGLE FAVORITE                              */
/* ========================================================================== */

export async function toggleFavorite(userId: string, mediaId: string) {
  const existing = await db
    .select({
      favorite: mediaInteraction.favorite,
    })
    .from(mediaInteraction)
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.mediaId, mediaId)
      )
    )
    .limit(1);

  const now = new Date();

  if (!existing[0]) {
    await db.insert(mediaInteraction).values({
      userId,
      mediaId,
      status: 'watchlist',
      favorite: true,
      rating: null,
      watchedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    return true;
  }

  const favorite = !existing[0].favorite;

  await db
    .update(mediaInteraction)
    .set({
      favorite,
      updatedAt: now,
    })
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.mediaId, mediaId)
      )
    );

  return favorite;
}

/* ========================================================================== */
/*                              REMOVE FROM SHELF                             */
/* ========================================================================== */

export async function removeFromShelf(userId: string, mediaId: string) {
  await db
    .delete(mediaInteraction)
    .where(
      and(
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.mediaId, mediaId)
      )
    );
}
