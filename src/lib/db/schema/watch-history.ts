import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { movie } from './movie';

export const watchHistory = pgTable(
  'watch_history',
  {
    id: text('id').primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    movieId: text('movie_id')
      .notNull()
      .references(() => movie.id, {
        onDelete: 'cascade',
      }),

    watchedAt: timestamp('watched_at').defaultNow().notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('watch_history_user_id_idx').on(table.userId),

    index('watch_history_movie_id_idx').on(table.movieId),

    index('watch_history_user_watched_at_idx').on(
      table.userId,
      table.watchedAt
    ),
  ]
);
