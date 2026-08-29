import { DISCOVER_PAGE_SIZE } from '@/lib/discover/pagination';
import {
  discoverMovies,
  getMovieDetails,
  getTrendingMovies,
  getUpcomingMovies,
  searchMovies,
} from '@/lib/tmdb/client';
import { mapTmdbMovie, mapTmdbMovieDetails } from '@/lib/tmdb/mapper';
import { Movie } from '../media';
import type { MovieRepository } from './types';

export const tmdbMovieRepository: MovieRepository = {
  async getById(id) {
    const movie = await getMovieDetails(id);

    return mapTmdbMovieDetails(movie);
  },

  async getPopular() {
    const response = await discoverMovies({
      type: 'movie',
      page: 1,
      sortBy: 'popularity.desc',
    });

    return response.results.map(mapTmdbMovie);
  },

  async getTrending() {
    const response = await getTrendingMovies('week');

    return response.results.map(mapTmdbMovie);
  },

  async getTopPicks() {
    const response = await discoverMovies({
      type: 'movie',
      page: 1,
      sortBy: 'vote_average.desc',
      minRating: 7.5,
      minVoteCount: 500,
    });

    return response.results.map(mapTmdbMovie).slice(0, 20);
  },

  async getUpcoming() {
    const response = await getUpcomingMovies();

    return response.results.map(mapTmdbMovie).slice(0, 20);
  },

  async search(query, options) {
    const page = options?.page ?? 1;

    const response = await searchMovies(query, page);

    return {
      media: response.results.map(mapTmdbMovie),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  },

  async discover(filters, options) {
    const appPage = filters.page ?? 1;

    const requestedCount = options?.maxResults ?? appPage * DISCOVER_PAGE_SIZE;

    const uniqueMedia = new Map<number, Movie>();

    let tmdbPage = 1;
    let totalResults = 0;
    let totalPages = 1;

    while (
      uniqueMedia.size < requestedCount &&
      tmdbPage <= 50 &&
      tmdbPage <= totalPages
    ) {
      const response = await discoverMovies({
        ...filters,
        page: tmdbPage,
      });

      totalResults = response.total_results;
      totalPages = response.total_pages;

      for (const result of response.results) {
        const mapped = mapTmdbMovie(result);

        uniqueMedia.set(mapped.tmdbId, mapped);
      }

      if (tmdbPage >= totalPages) {
        break;
      }

      tmdbPage += 1;
    }

    return {
      media: Array.from(uniqueMedia.values()),
      page: appPage,
      totalResults,
      totalPages: Math.max(1, Math.ceil(totalResults / DISCOVER_PAGE_SIZE)),
    };
  },
};
