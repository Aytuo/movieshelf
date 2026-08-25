import {
  getNowPlayingMovies,
  getPopularMovies,
  getRecommendedMoviesByTmdb,
  getTopPicksMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getUpcomingMovies,
} from '@/lib/tmdb/client';
import { mapTmdbMovie } from '@/lib/tmdb/mapper';

export async function getHomeMovieSections() {
  const [
    recommended,
    trending,
    topPicks,
    nowPlaying,
    upcoming,
    popular,
    topRated,
  ] = await Promise.all([
    getRecommendedMoviesByTmdb(),
    getTrendingMovies(),
    getTopPicksMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
  ]);

  return {
    recommended: recommended.results.map(mapTmdbMovie).slice(0, 20),
    trending: trending.results.map(mapTmdbMovie).slice(0, 20),
    topPicks: topPicks.results.map(mapTmdbMovie).slice(0, 20),
    nowPlaying: nowPlaying.results.map(mapTmdbMovie).slice(0, 20),
    upcoming: upcoming.results.map(mapTmdbMovie).slice(0, 20),
    popular: popular.results.map(mapTmdbMovie).slice(0, 20),
    topRated: topRated.results.map(mapTmdbMovie).slice(0, 20),
  };
}
