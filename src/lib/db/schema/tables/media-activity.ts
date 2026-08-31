import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { media } from './media';
import { review } from './social';

/* ========================================================================== */
/*                                   ENUMS                                    */
/* ========================================================================== */

export const mediaActivityType = pgEnum('media_activity_type', [
  'watchlist_added',
  'watching_started',
  'watched',
  'dropped',
  'favorite_added',
  'favorite_removed',
  'rated',
  'reviewed',
  'shelf_removed',
]);

export type MediaActivityType = (typeof mediaActivityType.enumValues)[number];

/* ========================================================================== */
/*                              MEDIA ACTIVITY                                */
/* ========================================================================== */

export const mediaActivity = pgTable('media_activity', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  mediaId: uuid('media_id')
    .notNull()
    .references(() => media.id, { onDelete: 'cascade' }),
  type: mediaActivityType('type').notNull(),

  // Optional event-specific data; currently used by: rated → rating, reviewed → reviewId

  rating: integer('rating'),
  reviewId: uuid('review_id').references(() => review.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
