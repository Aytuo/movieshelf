import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';

export async function getHomeSections() {
  const [
    moviePopular,
    movieTrending,
    nowPlaying,
    upcoming,
    topPicks,
    movieTopRated,
    tvPopular,
    tvTrending,
    airingToday,
    onTheAir,
    tvTopRated,
  ] = await Promise.all([
    tmdbMovieRepository.getPopular(),
    tmdbMovieRepository.getTrending(),
    tmdbMovieRepository.getNowPlaying(),
    tmdbMovieRepository.getUpcoming(),
    tmdbMovieRepository.getTopPicks(),
    tmdbMovieRepository.getTopRated(),

    tmdbTvRepository.getPopular(),
    tmdbTvRepository.getTrending(),
    tmdbTvRepository.getAiringToday(),
    tmdbTvRepository.getOnTheAir(),
    tmdbTvRepository.getTopRated(),
  ]);

  return {
    movies: {
      popular: moviePopular,
      trending: movieTrending,
      nowPlaying,
      upcoming,
      topPicks,
      topRated: movieTopRated,
    },

    tv: {
      popular: tvPopular,
      trending: tvTrending,
      airingToday,
      onTheAir,
      topRated: tvTopRated,
    },
  };
}
