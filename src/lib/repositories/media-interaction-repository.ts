import { db } from '@/lib/db';
import {
  media,
  mediaActivity,
  mediaInteraction,
  watchHistory,
} from '@/lib/db/schema';
import type { MediaKey, MediaType } from '@/lib/media';
import { and, count, desc, eq, isNotNull, or, sql } from 'drizzle-orm';

type DbMedia = typeof media.$inferSelect;
type DbMediaInteraction = typeof mediaInteraction.$inferSelect;

export type UserShelfRow = {
  media: DbMedia;
  interaction: DbMediaInteraction;
};

export type UserMediaStatsRow = {
  type: MediaType;
  total: number;
  watched: number;
  watchlist: number;
  watching: number;
  dropped: number;
  rated: number;
  favorites: number;
  averageRating: number | null;
};

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

export async function getUserWatchedOrRatedMediaKeys(
  userId: string,
  mediaKeys: MediaKey[]
) {
  if (mediaKeys.length === 0) {
    return [];
  }

  const matchingMedia = or(
    ...mediaKeys.map(({ tmdbId, type }) =>
      and(eq(media.tmdbId, tmdbId), eq(media.type, type))
    )
  );

  if (!matchingMedia) {
    return [];
  }

  return db
    .selectDistinct({
      tmdbId: media.tmdbId,
      type: media.type,
    })
    .from(media)
    .innerJoin(mediaActivity, eq(mediaActivity.mediaId, media.id))
    .where(
      and(
        matchingMedia,
        eq(mediaActivity.userId, userId),
        or(eq(mediaActivity.type, 'watched'), eq(mediaActivity.type, 'rated'))
      )
    );
}

export async function getUserShelfPreview(userId: string, limit = 16) {
  return db
    .select({
      tmdbId: media.tmdbId,
      type: media.type,
      title: media.title,
      posterPath: media.posterPath,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(eq(mediaInteraction.userId, userId))
    .orderBy(desc(mediaInteraction.updatedAt))
    .limit(limit);
}

export async function getUserShelf(userId: string): Promise<UserShelfRow[]> {
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
  const latestFavorites = db
    .selectDistinctOn([mediaActivity.mediaId], {
      mediaId: mediaActivity.mediaId,
      favoritedAt: mediaActivity.createdAt,
    })
    .from(mediaActivity)
    .where(
      and(
        eq(mediaActivity.userId, userId),
        eq(mediaActivity.type, 'favorite_added')
      )
    )
    .orderBy(mediaActivity.mediaId, desc(mediaActivity.createdAt))
    .as('latest_favorites');

  return db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(latestFavorites)
    .innerJoin(media, eq(media.id, latestFavorites.mediaId))
    .innerJoin(
      mediaInteraction,
      and(
        eq(mediaInteraction.mediaId, latestFavorites.mediaId),
        eq(mediaInteraction.userId, userId),
        eq(mediaInteraction.favorite, true)
      )
    )
    .orderBy(desc(latestFavorites.favoritedAt))
    .limit(limit);
}

export async function getUserLatestRated(userId: string, limit = 6) {
  const latestRatings = db
    .selectDistinctOn([mediaActivity.mediaId], {
      mediaId: mediaActivity.mediaId,
      ratedAt: mediaActivity.createdAt,
    })
    .from(mediaActivity)
    .where(
      and(eq(mediaActivity.userId, userId), eq(mediaActivity.type, 'rated'))
    )
    .orderBy(mediaActivity.mediaId, desc(mediaActivity.createdAt))
    .as('latest_ratings');

  return db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(latestRatings)
    .innerJoin(media, eq(media.id, latestRatings.mediaId))
    .innerJoin(
      mediaInteraction,
      and(
        eq(mediaInteraction.mediaId, latestRatings.mediaId),
        eq(mediaInteraction.userId, userId),
        isNotNull(mediaInteraction.rating)
      )
    )
    .orderBy(desc(latestRatings.ratedAt))
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
  const now = new Date();

  const result = await db.execute(sql<{ type: string }>`
    WITH toggled AS (
      INSERT INTO media_interaction (
        user_id,
        media_id,
        status,
        favorite,
        rating,
        watched_at,
        created_at,
        updated_at
      )
      VALUES (
        ${userId},
        ${mediaId},
        'watchlist',
        true,
        NULL,
        NULL,
        ${now},
        ${now}
      )
      ON CONFLICT (user_id, media_id)
      DO UPDATE SET
        favorite = NOT media_interaction.favorite,
        updated_at = EXCLUDED.updated_at
      RETURNING favorite
    )
    INSERT INTO media_activity (
      user_id,
      media_id,
      type,
      created_at
    )
    SELECT
      ${userId},
      ${mediaId},
      CASE
        WHEN toggled.favorite
          THEN 'favorite_added'::media_activity_type
        ELSE 'favorite_removed'::media_activity_type
      END,
      ${now}
    FROM toggled
    RETURNING type::text AS type
  `);

  const activity = result.rows[0];

  if (!activity) {
    throw new Error('Unable to update favorite state.');
  }

  return activity.type === 'favorite_added';
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

export async function getUserMediaStats(
  userId: string
): Promise<UserMediaStatsRow[]> {
  const rows = await db
    .select({
      type: media.type,
      total: count(mediaInteraction.id),
      watched: sql<number>`
        count(*) filter (
          where ${mediaInteraction.status} = 'watched'
        )
      `,
      watchlist: sql<number>`
        count(*) filter (
          where ${mediaInteraction.status} = 'watchlist'
        )
      `,
      watching: sql<number>`
        count(*) filter (
          where ${mediaInteraction.status} = 'watching'
        )
      `,
      dropped: sql<number>`
        count(*) filter (
          where ${mediaInteraction.status} = 'dropped'
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
