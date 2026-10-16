import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import type { Media, MediaKey, MediaType } from '@/lib/media';
import { and, asc, eq, or, sql } from 'drizzle-orm';

type DbMedia = typeof media.$inferSelect;
type DbMediaInsert = typeof media.$inferInsert;
type DbMediaCreate = Omit<DbMediaInsert, 'id' | 'createdAt' | 'updatedAt'>;

function mapDbMediaToMedia(row: DbMedia): Media {
  return {
    tmdbId: row.tmdbId,
    type: row.type,
    title: row.title,
    originalTitle: row.originalTitle,
    overview: row.overview,
    posterPath: row.posterPath,
    backdropPath: row.backdropPath,
    releaseDate: row.releaseDate,
    rating: Number(row.tmdbRating ?? 0),
    voteCount: row.tmdbVoteCount,
    originalLanguage: row.originalLanguage,
    genres: row.genres,
  };
}

export async function getMediaByTmdbId(
  tmdbId: number,
  type: MediaType
): Promise<Media | null> {
  const result = await db
    .select()
    .from(media)
    .where(and(eq(media.tmdbId, tmdbId), eq(media.type, type)))
    .limit(1);

  return result[0] ? mapDbMediaToMedia(result[0]) : null;
}

export async function getMediaRecordByTmdbId(
  tmdbId: number,
  type: MediaType
): Promise<DbMedia | null> {
  const result = await db
    .select()
    .from(media)
    .where(and(eq(media.tmdbId, tmdbId), eq(media.type, type)))
    .limit(1);

  return result[0] ?? null;
}

export async function getMediaRatingsByTmdbKeys(mediaKeys: MediaKey[]) {
  if (mediaKeys.length === 0) {
    return [];
  }

  const matchingMedia = or(
    ...mediaKeys.map(({ tmdbId, type }) =>
      and(eq(media.tmdbId, tmdbId), eq(media.type, type))
    )
  );

  if (!matchingMedia) {
    return [];
  }

  return db
    .select({
      tmdbId: media.tmdbId,
      type: media.type,
      rating: media.tmdbRating,
      voteCount: media.tmdbVoteCount,
    })
    .from(media)
    .where(matchingMedia);
}

export async function getMediaForRatingRefresh(limit: number) {
  return db
    .select({
      id: media.id,
      tmdbId: media.tmdbId,
      type: media.type,
    })
    .from(media)
    .orderBy(
      sql`${media.tmdbRatingCheckedAt} ASC NULLS FIRST`,
      asc(media.createdAt)
    )
    .limit(limit);
}

export async function updateMediaTmdbRating(
  mediaId: string,
  rating: number,
  voteCount: number
) {
  const checkedAt = new Date();

  await db
    .update(media)
    .set({
      tmdbRating: String(rating),
      tmdbVoteCount: voteCount,
      tmdbRatingCheckedAt: checkedAt,
      updatedAt: checkedAt,
    })
    .where(eq(media.id, mediaId));
}

export async function markMediaRatingChecked(mediaId: string) {
  const checkedAt = new Date();

  await db
    .update(media)
    .set({
      tmdbRatingCheckedAt: checkedAt,
      updatedAt: checkedAt,
    })
    .where(eq(media.id, mediaId));
}

export async function createMedia(data: DbMediaCreate) {
  const [created] = await db.insert(media).values(data).returning();

  return created;
}

export async function upsertMedia(data: DbMediaCreate) {
  const [result] = await db
    .insert(media)
    .values(data)
    .onConflictDoUpdate({
      target: [media.tmdbId, media.type],
      set: {
        title: data.title,
        originalTitle: data.originalTitle,
        overview: data.overview,
        posterPath: data.posterPath,
        backdropPath: data.backdropPath,
        releaseDate: data.releaseDate,
        runtime: data.runtime,
        genres: data.genres,
        tmdbRating: data.tmdbRating,
        tmdbVoteCount: data.tmdbVoteCount,
        tagline: data.tagline,
        updatedAt: new Date(),
      },
    })
    .returning();

  return result;
}

export async function deleteMedia(mediaId: string) {
  await db.delete(media).where(eq(media.id, mediaId));
}
