import { DISCOVER_PAGE_SIZE } from '@/lib/discover/pagination';
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
    const response = await discoverMovies({
      page: 1,
      sortBy: 'popularity.desc',
    });

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

  async discover(filters, options) {
    const appPage = filters.page ?? 1;

    const requestedCount = options?.maxMovies ?? appPage * DISCOVER_PAGE_SIZE;

    const uniqueMovies = new Map<number, Movie>();

    let tmdbPage = 1;

    let totalResults = 0;
    let totalPages = 1;

    while (
      uniqueMovies.size < requestedCount &&
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

        uniqueMovies.set(mapped.id, mapped);
      }

      if (tmdbPage >= totalPages) {
        break;
      }

      tmdbPage += 1;
    }

    const allMovies = Array.from(uniqueMovies.values());

    return {
      /*
       * IMPORTANT:
       * Return the candidate pool here.
       * Do NOT slice to the requested app page.
       *
       * discoverForUser() owns application-level
       * pagination because it may need to remove
       * movies already on the user's shelf first.
       */
      movies: allMovies,

      page: appPage,

      totalResults,

      totalPages: Math.max(1, Math.ceil(totalResults / DISCOVER_PAGE_SIZE)),
    };
  },
};
