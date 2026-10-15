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

export async function getMovieCatalogSections(): Promise<MovieCatalogSections> {
  const [popular, trending, topPicks, nowPlaying, upcoming, topRated] =
    await Promise.all([
      tmdbMovieRepository.getPopular(),
      tmdbMovieRepository.getTrending(),
      tmdbMovieRepository.getTopPicks(),
      tmdbMovieRepository.getNowPlaying(),
      tmdbMovieRepository.getUpcoming(),
      tmdbMovieRepository.getTopRated(),
    ]);

  const storedRatings = await getStoredMediaRatings([
    ...popular,
    ...trending,
    ...topPicks,
    ...nowPlaying,
    ...upcoming,
    ...topRated,
  ]);

  return {
    popular: applyStoredMediaRatings(popular, storedRatings),
    trending: applyStoredMediaRatings(trending, storedRatings),
    topPicks: applyStoredMediaRatings(topPicks, storedRatings),
    nowPlaying: applyStoredMediaRatings(nowPlaying, storedRatings),
    upcoming: applyStoredMediaRatings(upcoming, storedRatings),
    topRated: applyStoredMediaRatings(topRated, storedRatings),
  };
}

export async function getTvCatalogSections(): Promise<TvCatalogSections> {
  const [popular, trending, topPicks, airingToday, onTheAir, topRated] =
    await Promise.all([
      tmdbTvRepository.getPopular(),
      tmdbTvRepository.getTrending(),
      tmdbTvRepository.getTopPicks(),
      tmdbTvRepository.getAiringToday(),
      tmdbTvRepository.getOnTheAir(),
      tmdbTvRepository.getTopRated(),
    ]);

  const storedRatings = await getStoredMediaRatings([
    ...popular,
    ...trending,
    ...topPicks,
    ...airingToday.map((item) => item.media),
    ...onTheAir.map((item) => item.media),
    ...topRated,
  ]);

  return {
    popular: applyStoredMediaRatings(popular, storedRatings),
    trending: applyStoredMediaRatings(trending, storedRatings),
    topPicks: applyStoredMediaRatings(topPicks, storedRatings),
    airingToday: applyRatingsToSchedule(airingToday, storedRatings),
    onTheAir: applyRatingsToSchedule(onTheAir, storedRatings),
    topRated: applyStoredMediaRatings(topRated, storedRatings),
  };
}
