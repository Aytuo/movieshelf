import { db } from '@/lib/db';
import {
  media,
  mediaActivity,
  mediaInteraction,
  watchHistory,
} from '@/lib/db/schema';
import type { MediaType } from '@/lib/media';
import { and, count, desc, eq, sql } from 'drizzle-orm';

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

export async function getUserMediaKeys(userId: string) {
  return db
    .select({
      tmdbId: media.tmdbId,
      type: media.type,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(eq(mediaInteraction.userId, userId));
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

export async function getUserShelfForType(userId: string, type: MediaType) {
  return db
    .select({ media, interaction: mediaInteraction })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(and(eq(mediaInteraction.userId, userId), eq(media.type, type)))
    .orderBy(desc(mediaInteraction.updatedAt));
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

export async function getUserFavorites(userId: string, limit = 6) {
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
    .orderBy(desc(mediaInteraction.updatedAt))
    .limit(limit);
}

export async function addMediaToWatchlist({
  userId,
  mediaId,
  now = new Date(),
}: {
  userId: string;
  mediaId: string;
  now?: Date;
}) {
  await db.batch([
    db
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
      }),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'watchlist_added',
      createdAt: now,
    }),
  ]);
}

export async function startMediaWatching({
  userId,
  mediaId,
  now = new Date(),
}: {
  userId: string;
  mediaId: string;
  now?: Date;
}) {
  await db.batch([
    db
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
      }),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'watching_started',
      createdAt: now,
    }),
  ]);
}

export async function markMediaAsWatched({
  userId,
  mediaId,
  watchedAt = new Date(),
}: {
  userId: string;
  mediaId: string;
  watchedAt?: Date;
}) {
  await db.batch([
    db
      .insert(mediaInteraction)
      .values({
        userId,
        mediaId,
        status: 'watched',
        favorite: false,
        rating: null,
        watchedAt,
        createdAt: watchedAt,
        updatedAt: watchedAt,
      })
      .onConflictDoUpdate({
        target: [mediaInteraction.userId, mediaInteraction.mediaId],
        set: {
          status: 'watched',
          watchedAt,
          updatedAt: watchedAt,
        },
      }),

    db.insert(watchHistory).values({
      userId,
      mediaId,
      watchedAt,
      createdAt: watchedAt,
    }),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'watched',
      createdAt: watchedAt,
    }),
  ]);

  const [result] = await db
    .select({
      count: count(),
    })
    .from(watchHistory)
    .where(
      and(eq(watchHistory.userId, userId), eq(watchHistory.mediaId, mediaId))
    );

  return result?.count ?? 0;
}

export async function markMediaAsDropped({
  userId,
  mediaId,
  now = new Date(),
}: {
  userId: string;
  mediaId: string;
  now?: Date;
}) {
  await db.batch([
    db
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
      }),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'dropped',
      createdAt: now,
    }),
  ]);
}

export async function setMediaRating({
  userId,
  mediaId,
  rating,
  now = new Date(),
}: {
  userId: string;
  mediaId: string;
  rating: number;
  now?: Date;
}) {
  await db.batch([
    db
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
      }),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'rated',
      rating,
      createdAt: now,
    }),
  ]);
}

export async function toggleMediaFavorite({
  userId,
  mediaId,
}: {
  userId: string;
  mediaId: string;
}) {
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
    await db.batch([
      db.insert(mediaInteraction).values({
        userId,
        mediaId,
        status: 'watchlist',
        favorite: true,
        rating: null,
        watchedAt: null,
        createdAt: now,
        updatedAt: now,
      }),

      db.insert(mediaActivity).values({
        userId,
        mediaId,
        type: 'favorite_added',
        createdAt: now,
      }),
    ]);

    return true;
  }

  const favorite = !existing[0].favorite;

  await db.batch([
    db
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
      ),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: favorite ? 'favorite_added' : 'favorite_removed',
      createdAt: now,
    }),
  ]);

  return favorite;
}

export async function removeMediaFromShelf({
  userId,
  mediaId,
  now = new Date(),
}: {
  userId: string;
  mediaId: string;
  now?: Date;
}) {
  await db.batch([
    db
      .delete(mediaInteraction)
      .where(
        and(
          eq(mediaInteraction.userId, userId),
          eq(mediaInteraction.mediaId, mediaId)
        )
      ),

    db.insert(mediaActivity).values({
      userId,
      mediaId,
      type: 'shelf_removed',
      createdAt: now,
    }),
  ]);
}

export async function getPublicMediaStats(userId: string) {
  const rows = await db
    .select({
      type: media.type,
      total: count(mediaInteraction.id),
      watched: sql<number>`
        count(*) filter (
          where ${mediaInteraction.status} = 'watched'
        )
      `,
      rated: sql<number>`
        count(*) filter (
          where ${mediaInteraction.rating} is not null
        )
      `,
      favorites: sql<number>`
        count(*) filter (
          where ${mediaInteraction.favorite} = true
        )
      `,
      averageRating: sql<number | null>`
        avg(${mediaInteraction.rating})
      `,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(eq(mediaInteraction.userId, userId))
    .groupBy(media.type);

  return rows;
}
