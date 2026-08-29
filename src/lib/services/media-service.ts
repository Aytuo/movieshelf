import type { Media, MediaDetails, MovieDetails, TvDetails } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';
import {
  getMediaByTmdbId,
  upsertMedia,
} from '@/lib/repositories/media-repository';

/* ========================================================================== */
/*                                 GET DETAILS                                */
/* ========================================================================== */

export async function getMediaDetails(
  type: 'movie',
  tmdbId: number
): Promise<MovieDetails>;

export async function getMediaDetails(
  type: 'tv',
  tmdbId: number
): Promise<TvDetails>;

export async function getMediaDetails(
  type: 'movie' | 'tv',
  tmdbId: number
): Promise<MediaDetails> {
  if (type === 'movie') {
    return tmdbMovieRepository.getById(tmdbId);
  }

  return tmdbTvRepository.getById(tmdbId);
}

/* ========================================================================== */
/*                                GET OR CREATE                               */
/* ========================================================================== */

export async function getOrCreateMedia(
  type: 'movie' | 'tv',
  tmdbId: number
): Promise<Media> {
  const existing = await getMediaByTmdbId(tmdbId, type);

  if (existing) {
    return existing;
  }

  const details =
    type === 'movie'
      ? await tmdbMovieRepository.getById(tmdbId)
      : await tmdbTvRepository.getById(tmdbId);

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
