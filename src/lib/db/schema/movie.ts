import {
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const movie = pgTable(
  'movie',
  {
    id: text('id').primaryKey(),
    tmdbId: integer('tmdb_id').notNull().unique(),
    title: text('title').notNull(),
    originalTitle: text('original_title').notNull(),
    overview: text('overview'),
    posterPath: text('poster_path'),
    backdropPath: text('backdrop_path'),
    releaseDate: text('release_date'),
    runtime: integer('runtime'),
    genres: text('genres').array(),
    rating: numeric('rating', {
      precision: 3,
      scale: 1,
    }),
    voteCount: integer('vote_count'),
    tagline: text('tagline'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('movie_tmdb_id_idx').on(table.tmdbId)]
);
