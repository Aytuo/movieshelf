import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { movie } from './movie';

export const userMovie = pgTable(
  'user_movie',
  {
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
    status: text('status')
      .$type<'watched' | 'watchlist'>()
      .notNull()
      .default('watchlist'),
    rating: integer('rating'),
    favorite: boolean('favorite').notNull().default(false),
    watchedAt: timestamp('watched_at'),
    addedAt: timestamp('added_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.movieId],
    }),
    index('user_movie_user_id_idx').on(table.userId),
    index('user_movie_movie_id_idx').on(table.movieId),
  ]
);
