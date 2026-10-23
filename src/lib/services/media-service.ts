import type { MediaDetails, MediaType, TvSeasonDetails } from '@/lib/media';
import {
  getMediaRecordByTmdbId,
  getMediaReviews,
  getUserMediaInteraction,
  getUserReviewForMedia,
  tmdbMovieRepository,
  tmdbTvRepository,
  upsertMedia,
} from '@/lib/repositories';
import type { MediaRecord } from '@/types';
import { withStoredMediaRatings } from './media-rating-service';
import { getMediaPosts } from './post-service';
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

export async function getMediaDetailsCorePageData(
  type: MediaType,
  tmdbId: number,
  userId: string
) {
  const mediaDetails = await getMediaDetails(type, tmdbId);

  const similarCount = mediaDetails.similar.length;

  const ratedRelatedMedia = await withStoredMediaRatings([
    ...mediaDetails.similar,
    ...mediaDetails.recommendations,
  ]);

  const mediaWithRatedRelatedItems: MediaDetails = {
    ...mediaDetails,
    similar: ratedRelatedMedia.slice(0, similarCount),
    recommendations: ratedRelatedMedia.slice(similarCount),
  };

  const mediaRecord = await getOrCreateMediaRecord(type, tmdbId, mediaDetails);

  const [mediaInteraction, existingReview] = await Promise.all([
    getUserMediaInteraction(userId, mediaRecord.id),
    getUserReviewForMedia(userId, mediaRecord.id),
  ]);

  const watchNumber =
    mediaInteraction?.status === 'watched'
      ? await getMediaWatchCountForUser(userId, mediaRecord.id)
      : null;

  return {
    media: mediaWithRatedRelatedItems,
    mediaRecordId: mediaRecord.id,
    mediaInteraction,
    watchNumber,
    existingReview,
  };
}

export async function getMediaDetailsReviews(mediaRecordId: string) {
  return getMediaReviews(mediaRecordId);
}

export async function getMediaDetailsPosts(
  mediaRecordId: string,
  userId: string
) {
  return getMediaPosts(mediaRecordId, userId, {
    limit: 5,
  });
}

export async function getMediaDetailsPageData(
  type: MediaType,
  tmdbId: number,
  userId: string
) {
  const core = await getMediaDetailsCorePageData(type, tmdbId, userId);

  const [reviews, postsPage] = await Promise.all([
    getMediaDetailsReviews(core.mediaRecordId),
    getMediaDetailsPosts(core.mediaRecordId, userId),
  ]);

  return {
    media: core.media,
    mediaInteraction: core.mediaInteraction,
    watchNumber: core.watchNumber,
    existingReview: core.existingReview,
    reviews,
    posts: postsPage.posts,
    postCursor: postsPage.nextCursor,
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
  if (!details) {
    const existing = await getMediaRecordByTmdbId(tmdbId, type);

    if (
      existing &&
      Array.isArray(existing.genres) &&
      existing.genres.length > 0
    ) {
      return existing;
    }
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

/* ========================================================================== */
/*                             GET TV SEASON DETAILS                          */
/* ========================================================================== */

export async function getTvSeason(
  tvId: number,
  seasonNumber: number
): Promise<TvSeasonDetails> {
  return tmdbTvRepository.getSeason(tvId, seasonNumber);
}
