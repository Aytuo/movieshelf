import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/* ========================================================================== */
/*                                   ENUMS                                    */
/* ========================================================================== */

export const mediaTypeEnum = pgEnum('media_type', ['movie', 'tv']);

/* ========================================================================== */
/*                                    MEDIA                                   */
/* ========================================================================== */

export const media = pgTable(
  'media',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    tmdbId: integer('tmdb_id').notNull(), // ID of the entity in TMDB.
    type: mediaTypeEnum('type').notNull(), // Domain type of the media: The combination of tmdbId + type identifies a unique TMDB entity in database.
    title: text('title').notNull(),
    originalTitle: text('original_title').notNull(),
    overview: text('overview').notNull().default(''),
    posterPath: text('poster_path'),
    backdropPath: text('backdrop_path'),
    releaseDate: text('release_date'),
    runtime: integer('runtime'), // Movie runtime: NULL for TV shows or when TMDB does not provide it.
    genres: jsonb('genres')
      .$type<Array<{ id: number; name: string }>>()
      .notNull()
      .default(sql`'[]'::jsonb`), // Stored as: [ { id: 28, name: 'Action' }, { id: 18, name: 'Drama' } ].
    originalLanguage: text('original_language').notNull().default(''),
    tmdbRating: numeric('tmdb_rating', {
      precision: 3,
      scale: 1,
    }), // TMDB rating.
    tmdbVoteCount: integer('tmdb_vote_count').notNull().default(0), // Number of TMDB votes.
    tagline: text('tagline'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('media_tmdb_type_idx').on(table.tmdbId, table.type),
    index('media_type_idx').on(table.type),
    index('media_tmdb_id_idx').on(table.tmdbId),
  ]
);
