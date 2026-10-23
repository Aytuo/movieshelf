import type { Media, TvScheduleItem } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';
import type { StoredMediaRatingMap } from './media-rating-service';
import {
  applyStoredMediaRatings,
  getMediaKey,
  getStoredMediaRatings,
} from './media-rating-service';

export type MovieCatalogSections = {
  popular: Media[];
  trending: Media[];
  topPicks: Media[];
  nowPlaying: Media[];
  upcoming: Media[];
  topRated: Media[];
};

export type TvCatalogSections = {
  popular: Media[];
  trending: Media[];
  topPicks: Media[];
  airingToday: TvScheduleItem[];
  onTheAir: TvScheduleItem[];
  topRated: Media[];
};

export type MovieFeaturedSections = Pick<
  MovieCatalogSections,
  'popular' | 'trending' | 'topPicks'
>;

export type MovieReleaseSections = Pick<
  MovieCatalogSections,
  'nowPlaying' | 'upcoming' | 'topRated'
>;

export type TvFeaturedSections = Pick<
  TvCatalogSections,
  'popular' | 'trending' | 'topPicks'
>;

export type TvScheduleSections = Pick<
  TvCatalogSections,
  'airingToday' | 'onTheAir' | 'topRated'
>;

function applyRatingsToSchedule(
  items: TvScheduleItem[],
  storedRatings: StoredMediaRatingMap
): TvScheduleItem[] {
  return items.map((item) => {
    const storedRating = storedRatings.get(getMediaKey(item.media));

    if (!storedRating) {
      return item;
    }

    return {
      ...item,
      media: {
        ...item.media,
        rating: storedRating.rating,
        voteCount: storedRating.voteCount,
      },
    };
  });
}

export async function getMovieFeaturedSections(): Promise<MovieFeaturedSections> {
  const [popular, trending, topPicks] = await Promise.all([
    tmdbMovieRepository.getPopular(),
    tmdbMovieRepository.getTrending(),
    tmdbMovieRepository.getTopPicks(),
  ]);

  const storedRatings = await getStoredMediaRatings([
    ...popular,
    ...trending,
    ...topPicks,
  ]);

  return {
    popular: applyStoredMediaRatings(popular, storedRatings),
    trending: applyStoredMediaRatings(trending, storedRatings),
    topPicks: applyStoredMediaRatings(topPicks, storedRatings),
  };
}

export async function getMovieReleaseSections(): Promise<MovieReleaseSections> {
  const [nowPlaying, upcoming, topRated] = await Promise.all([
    tmdbMovieRepository.getNowPlaying(),
    tmdbMovieRepository.getUpcoming(),
    tmdbMovieRepository.getTopRated(),
  ]);

  const storedRatings = await getStoredMediaRatings([
    ...nowPlaying,
    ...upcoming,
    ...topRated,
  ]);

  return {
    nowPlaying: applyStoredMediaRatings(nowPlaying, storedRatings),
    upcoming: applyStoredMediaRatings(upcoming, storedRatings),
    topRated: applyStoredMediaRatings(topRated, storedRatings),
  };
}

export async function getTvFeaturedSections(): Promise<TvFeaturedSections> {
  const [popular, trending, topPicks] = await Promise.all([
    tmdbTvRepository.getPopular(),
    tmdbTvRepository.getTrending(),
    tmdbTvRepository.getTopPicks(),
  ]);

  const storedRatings = await getStoredMediaRatings([
    ...popular,
    ...trending,
    ...topPicks,
  ]);

  return {
    popular: applyStoredMediaRatings(popular, storedRatings),
    trending: applyStoredMediaRatings(trending, storedRatings),
    topPicks: applyStoredMediaRatings(topPicks, storedRatings),
  };
}

export async function getTvScheduleSections(): Promise<TvScheduleSections> {
  const [airingToday, onTheAir, topRated] = await Promise.all([
    tmdbTvRepository.getAiringToday(),
    tmdbTvRepository.getOnTheAir(),
    tmdbTvRepository.getTopRated(),
  ]);

  const storedRatings = await getStoredMediaRatings([
    ...airingToday.map((item) => item.media),
    ...onTheAir.map((item) => item.media),
    ...topRated,
  ]);

  return {
    airingToday: applyRatingsToSchedule(airingToday, storedRatings),
    onTheAir: applyRatingsToSchedule(onTheAir, storedRatings),
    topRated: applyStoredMediaRatings(topRated, storedRatings),
  };
}

export async function getMovieCatalogSections(): Promise<MovieCatalogSections> {
  const [featured, releases] = await Promise.all([
    getMovieFeaturedSections(),
    getMovieReleaseSections(),
  ]);

  return { ...featured, ...releases };
}

export async function getTvCatalogSections(): Promise<TvCatalogSections> {
  const [featured, schedule] = await Promise.all([
    getTvFeaturedSections(),
    getTvScheduleSections(),
  ]);

  return { ...featured, ...schedule };
}
