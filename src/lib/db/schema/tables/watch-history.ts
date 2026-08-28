import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { media } from './media';

/* ========================================================================== */
/*                                 WATCH HISTORY                              */
/* ========================================================================== */

export const watchHistory = pgTable(
  'watch_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    mediaId: uuid('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    watchedAt: timestamp('watched_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('watch_history_user_id_idx').on(table.userId),
    index('watch_history_media_id_idx').on(table.mediaId),
    index('watch_history_user_watched_at_idx').on(
      table.userId,
      table.watchedAt
    ),
  ]
);
