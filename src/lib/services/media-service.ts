import type { Media, MediaDetails, MediaType } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';
import {
  getMediaByTmdbId,
  upsertMedia,
} from '@/lib/repositories/media-repository';

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
/*                                GET OR CREATE                               */
/* ========================================================================== */

export async function getOrCreateMedia(
  type: MediaType,
  tmdbId: number
): Promise<Media> {
  const existing = await getMediaByTmdbId(tmdbId, type);

  if (existing) {
    return existing;
  }

  const details = await getMediaRepository(type).getById(tmdbId);

  await upsertMedia({
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

  const created = await getMediaByTmdbId(tmdbId, type);

  if (!created) {
    throw new Error('Failed to create media.');
  }

  return created;
}
