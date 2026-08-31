import { DISCOVER_PAGE_SIZE } from '@/lib/discover/pagination';
import type { Movie } from '@/lib/media';
import { mapTmdbMovie, mapTmdbMovieDetails } from '@/lib/tmdb/mapper';
import {
  discover,
  getMovie,
  getPopular,
  getTrending,
  search as searchMovies,
} from '@/lib/tmdb/movie-api';
import { MovieDiscoverFilters } from '@/types';
import { paginateSearchResults } from '../search/pagination';
import { MovieRepository } from './types';

export const tmdbMovieRepository: MovieRepository = {
  async getById(id) {
    const result = await getMovie(id);

    return mapTmdbMovieDetails(result);
  },

  async getPopular() {
    const result = await getPopular();

    return result.results.map(mapTmdbMovie);
  },

  async getTrending() {
    const result = await getTrending('week');

    return result.results.map(mapTmdbMovie);
  },

  async getNowPlaying() {
    const today = new Date();

    const pastDate = new Date(today);
    pastDate.setDate(pastDate.getDate() - 42);

    const minDate = toDateString(pastDate);
    const maxDate = toDateString(today);

    const result = await discover({
      page: 1,
      sortBy: 'popularity.desc',
      withReleaseType: '2|3',
      primaryReleaseDateGte: minDate,
      primaryReleaseDateLte: maxDate,
    });

    return result.results.map(mapTmdbMovie).slice(0, 20);
  },

  async getUpcoming() {
    const today = new Date();

    const futureDate = new Date(today);
    futureDate.setMonth(futureDate.getMonth() + 3);

    const minDate = toDateString(today);
    const maxDate = toDateString(futureDate);

    const result = await discover({
      page: 1,
      sortBy: 'popularity.desc',
      withReleaseType: '2|3',
      primaryReleaseDateGte: minDate,
      primaryReleaseDateLte: maxDate,
    });

    return result.results.map(mapTmdbMovie).slice(0, 20);
  },

  async getTopPicks() {
    const result = await discover({
      page: 1,
      sortBy: 'vote_average.desc',
      voteAverageGte: 7.5,
      voteCountGte: 500,
    });

    return result.results.map(mapTmdbMovie).slice(0, 20);
  },

  async getTopRated() {
    const today = toDateString(new Date());

    const result = await discover({
      page: 1,
      sortBy: 'vote_average.desc',
      withoutGenres: '99,10755',
      voteCountGte: 10_000,
      primaryReleaseDateLte: today,
    });

    return result.results.map(mapTmdbMovie).slice(0, 20);
  },

  async search(query, options) {
    const result = await paginateSearchResults(options?.page ?? 1, (page) =>
      searchMovies(query, page, options?.year)
    );

    return {
      media: result.media.map(mapTmdbMovie),
      page: result.page,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
    };
  },

  async discover(filters, options) {
    const appPage = filters.page ?? 1;

    const requestedCount = options?.maxResults ?? appPage * DISCOVER_PAGE_SIZE;

    const uniqueMovies = new Map<number, Movie>();

    let tmdbPage = 1;
    let totalResults = 0;
    let totalPages = 1;

    while (
      uniqueMovies.size < requestedCount &&
      tmdbPage <= 50 &&
      tmdbPage <= totalPages
    ) {
      const result = await discover(toTmdbDiscoverParams(filters, tmdbPage));

      totalResults = result.total_results;

      totalPages = result.total_pages;

      for (const item of result.results) {
        const movie = mapTmdbMovie(item);

        uniqueMovies.set(movie.tmdbId, movie);
      }

      if (tmdbPage >= totalPages) {
        break;
      }

      tmdbPage += 1;
    }

    return {
      media: Array.from(uniqueMovies.values()),
      page: appPage,
      totalResults,
      totalPages: Math.max(1, Math.ceil(totalResults / DISCOVER_PAGE_SIZE)),
    };
  },
};

function toTmdbDiscoverParams(filters: MovieDiscoverFilters, page: number) {
  return {
    page,
    sortBy: filters.sortBy ?? 'popularity.desc',

    ...(filters.genre !== undefined
      ? {
          withGenres: String(filters.genre),
        }
      : {}),

    ...(filters.yearFrom !== undefined
      ? {
          primaryReleaseDateGte: `${filters.yearFrom}-01-01`,
        }
      : {}),

    ...(filters.yearTo !== undefined
      ? {
          primaryReleaseDateLte: `${filters.yearTo}-12-31`,
        }
      : {}),

    ...(filters.minRating !== undefined
      ? {
          voteAverageGte: filters.minRating,
        }
      : {}),

    ...(filters.maxRating !== undefined
      ? {
          voteAverageLte: filters.maxRating,
        }
      : {}),

    ...(filters.minVoteCount !== undefined
      ? {
          voteCountGte: filters.minVoteCount,
        }
      : {}),

    ...(filters.minRuntime !== undefined
      ? {
          runtimeGte: filters.minRuntime,
        }
      : {}),

    ...(filters.maxRuntime !== undefined
      ? {
          runtimeLte: filters.maxRuntime,
        }
      : {}),

    ...(filters.language
      ? {
          originalLanguage: filters.language,
        }
      : {}),
  };
}

function toDateString(date: Date) {
  return date.toISOString().split('T')[0];
}
