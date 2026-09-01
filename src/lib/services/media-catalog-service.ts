import type { Media } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';

export type MovieCatalogSections = {
  trending: Media[];
  popular: Media[];
  topPicks: Media[];
  nowPlaying: Media[];
  upcoming: Media[];
  topRated: Media[];
};

export type TvCatalogSections = {
  trending: Media[];
  popular: Media[];
  topPicks: Media[];
  airingToday: Media[];
  onTheAir: Media[];
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
  const [trending, popular, topPicks, topRated, airingToday, onTheAir] =
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
