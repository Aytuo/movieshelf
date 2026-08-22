import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { movie } from './movie';

export const review = pgTable(
  'review',
  {
    id: uuid('id').defaultRandom().primaryKey(),
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
    title: text('title'),
    content: text('content').notNull(),
    rating: integer('rating'),
    containsSpoilers: boolean('contains_spoilers').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('review_user_movie_idx').on(table.userId, table.movieId),
    index('review_movie_id_idx').on(table.movieId),
    index('review_user_id_idx').on(table.userId),
    check(
      'review_rating_range',
      sql`${table.rating} IS NULL OR ${table.rating} BETWEEN 1 AND 10`
    ),
  ]
);
