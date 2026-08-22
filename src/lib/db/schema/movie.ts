import {
  index,
  integer,
  numeric,
  pgEnum,
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
    tmdbRating: numeric('tmdb_rating', {
      precision: 3,
      scale: 1,
      mode: 'number',
    }),
    tmdbVoteCount: integer('tmdb_vote_count'),
    tagline: text('tagline'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('movie_tmdb_id_idx').on(table.tmdbId)]
);

export const movieStatus = pgEnum('movie_status', ['watchlist', 'watched']);
