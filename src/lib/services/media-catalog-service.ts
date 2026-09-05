import type { Media, TvScheduleItem } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';

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

  return {
    popular,
    trending,
    topPicks,
    nowPlaying,
    upcoming,
    topRated,
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

  return {
    popular,
    trending,
    topPicks,
    airingToday,
    onTheAir,
    topRated,
  };
}
