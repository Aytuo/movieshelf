import {
  discoverMovies,
  getMovieDetails,
  getTrendingMovies,
  searchMovies,
} from '@/lib/tmdb/client';
import { mapTmdbMovie, mapTmdbMovieDetails } from '@/lib/tmdb/mapper';

export const tmdbMovieRepository: MovieRepository = {
  async getById(id) {
    const movie = await getMovieDetails(id);

    return mapTmdbMovieDetails(movie);
  },

  async getPopular() {
    const response = await discoverMovies();

    return response.results.map(mapTmdbMovie);
  },

  async getTrending() {
    const response = await getTrendingMovies('week');

    return response.results.map(mapTmdbMovie);
  },

  async search(query) {
    const response = await searchMovies(query, 1);

    return response.results.map(mapTmdbMovie);
  },

  async discover(filters) {
    const response = await discoverMovies(filters);

    return {
      movies: response.results.map(mapTmdbMovie),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  },
};
