import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { media } from './media';

/* ========================================================================== */
/*                                   ENUMS                                    */
/* ========================================================================== */

export const mediaStatusEnum = pgEnum('media_status', [
  'watchlist',
  'watching',
  'watched',
  'dropped',
]);

/* ========================================================================== */
/*                            MEDIA INTERACTION                               */
/* ========================================================================== */

export const mediaInteraction = pgTable(
  'media_interaction',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    status: mediaStatusEnum('status').notNull(), // User's shelf status.
    rating: integer('rating'), // User rating: NULL = not rated yet.
    favorite: boolean('favorite').default(false).notNull(),
    watchedAt: timestamp('watched_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('user_media_interaction_idx').on(table.userId, table.mediaId),
    check(
      'media_interaction_rating_range_check',
      sql`${table.rating} IS NULL OR ${table.rating} BETWEEN 1 AND 10`
    ),
    index('media_interaction_user_idx').on(table.userId),
    index('media_interaction_media_idx').on(table.mediaId),
  ]
);
