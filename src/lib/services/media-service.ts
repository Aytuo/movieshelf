import { media } from '@/lib/db/schema';
import type { MediaDetails, MediaType } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';
import {
  getMediaRecordByTmdbId,
  upsertMedia,
} from '@/lib/repositories/media-repository';
import type { InferSelectModel } from 'drizzle-orm';

type MediaRecord = InferSelectModel<typeof media>;

function getMediaRepository(type: MediaType) {
  return type === 'movie' ? tmdbMovieRepository : tmdbTvRepository;
}

/* ========================================================================== */
/*                                 GET DETAILS                                */
/* ========================================================================== */

export async function getMediaDetails(
  type: MediaType,
  tmdbId: number
): Promise<MediaDetails> {
  return getMediaRepository(type).getById(tmdbId);
}

/* ========================================================================== */
/*                          GET OR CREATE MEDIA RECORD                        */
/* ========================================================================== */

export async function getOrCreateMediaRecord(
  type: MediaType,
  tmdbId: number
): Promise<MediaRecord> {
  const existing = await getMediaRecordByTmdbId(tmdbId, type);

  if (existing) {
    return existing;
  }

  const details = await getMediaRepository(type).getById(tmdbId);

  return upsertMedia({
    tmdbId: details.tmdbId,
    type: details.type,
    title: details.title,
    originalTitle: details.originalTitle,
    overview: details.overview,
    posterPath: details.posterPath,
    backdropPath: details.backdropPath,
    releaseDate: details.releaseDate,
    runtime: details.type === 'movie' ? details.runtime : null,
    genres: details.genres,
    originalLanguage: details.originalLanguage,
    tmdbRating: String(details.rating),
    tmdbVoteCount: details.voteCount,
    tagline: details.tagline,
  });
}
