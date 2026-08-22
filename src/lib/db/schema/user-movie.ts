import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { movie, movieStatus } from './movie';

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
    status: movieStatus('status').notNull().default('watchlist'),
    rating: numeric('rating', {
      precision: 3,
      scale: 1,
      mode: 'number',
    }),
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
    check(
      'user_movie_rating_range',
      sql`${table.rating} IS NULL OR ${table.rating} BETWEEN 1 AND 10`
    ),
  ]
);
