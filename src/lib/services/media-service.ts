import type { MediaDetails, MediaType } from '@/lib/media';
import {
  getMediaReviews,
  getUserMediaInteraction,
  getUserReviewForMedia,
  tmdbMovieRepository,
  tmdbTvRepository,
} from '@/lib/repositories';
import {
  getMediaRecordByTmdbId,
  upsertMedia,
} from '@/lib/repositories/media-repository';
import type { MediaRecord } from '@/types';
import { getMediaWatchCountForUser } from './watch-history-service';

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
/*                         GET MEDIA DETAILS PAGE DATA                        */
/* ========================================================================== */

export async function getMediaDetailsPageData(
  type: MediaType,
  tmdbId: number,
  userId: string
) {
  const mediaDetails = await getMediaDetails(type, tmdbId);

  const mediaRecord = await getOrCreateMediaRecord(type, tmdbId, mediaDetails);

  const [mediaInteraction, existingReview, reviews] = await Promise.all([
    getUserMediaInteraction(userId, mediaRecord.id),
    getUserReviewForMedia(userId, mediaRecord.id),
    getMediaReviews(mediaRecord.id),
  ]);

  const watchNumber =
    mediaInteraction?.status === 'watched'
      ? await getMediaWatchCountForUser(userId, mediaRecord.id)
      : null;

  return {
    media: mediaDetails,
    mediaInteraction,
    watchNumber,
    existingReview,
    reviews,
  };
}

/* ========================================================================== */
/*                          GET OR CREATE MEDIA RECORD                        */
/* ========================================================================== */

export async function getOrCreateMediaRecord(
  type: MediaType,
  tmdbId: number,
  details?: MediaDetails
): Promise<MediaRecord> {
  const existing = await getMediaRecordByTmdbId(tmdbId, type);

  if (existing) {
    return existing;
  }

  const source = details ?? (await getMediaDetails(type, tmdbId));

  return upsertMedia({
    tmdbId: source.tmdbId,
    type: source.type,
    title: source.title,
    originalTitle: source.originalTitle,
    overview: source.overview,
    posterPath: source.posterPath,
    backdropPath: source.backdropPath,
    releaseDate: source.releaseDate,
    runtime: source.type === 'movie' ? source.runtime : null,
    genres: source.genres,
    originalLanguage: source.originalLanguage,
    tmdbRating: String(source.rating),
    tmdbVoteCount: source.voteCount,
    tagline: source.tagline,
  });
}
