import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import type { Media, MediaType } from '@/lib/media';
import { and, eq } from 'drizzle-orm';

type DbMedia = typeof media.$inferSelect;

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

export async function createMedia(
  data: Omit<typeof media.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>
) {
  const [created] = await db.insert(media).values(data).returning();

  return created;
}

export async function upsertMedia(
  data: Omit<typeof media.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>
) {
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
