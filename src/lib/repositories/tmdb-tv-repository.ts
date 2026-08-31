import { DISCOVER_PAGE_SIZE } from '@/lib/discover/pagination';
import type { TvShow } from '@/lib/media';
import { mapTmdbTv, mapTmdbTvDetails } from '@/lib/tmdb/mapper';
import {
  discover,
  getPopular,
  getTrending,
  getTv,
  search as searchTv,
} from '@/lib/tmdb/tv-api';
import { TvDiscoverFilters } from '@/types';
import { paginateSearchResults } from '../search/pagination';
import { TvRepository } from './types';

export const tmdbTvRepository: TvRepository = {
  async getById(id) {
    const result = await getTv(id);

    return mapTmdbTvDetails(result);
  },

  async getPopular() {
    const result = await getPopular();

    return result.results.map(mapTmdbTv);
  },

  async getTrending() {
    const result = await getTrending('week');

    return result.results.map(mapTmdbTv);
  },

  async getAiringToday() {
    const today = toDateString(new Date());

    const result = await discover({
      page: 1,
      sortBy: 'popularity.desc',
      airDateGte: today,
      airDateLte: today,
    });

    return result.results.map(mapTmdbTv).slice(0, 20);
  },

  async getOnTheAir() {
    const today = new Date();

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const result = await discover({
      page: 1,
      sortBy: 'popularity.desc',
      airDateGte: toDateString(today),
      airDateLte: toDateString(nextWeek),
    });

    return result.results.map(mapTmdbTv).slice(0, 20);
  },

  async getTopRated() {
    const result = await discover({
      page: 1,
      sortBy: 'vote_average.desc',
      voteAverageGte: 8,
      voteCountGte: 1000,
    });

    return result.results
      .map(mapTmdbTv)
      .filter((show) => show.voteCount >= 1000)
      .slice(0, 20);
  },

  async search(query, options) {
    const result = await paginateSearchResults(options?.page ?? 1, (page) =>
      searchTv(query, page, options?.year)
    );

    return {
      media: result.media.map(mapTmdbTv),
      page: result.page,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
    };
  },

  async discover(filters, options) {
    const appPage = filters.page ?? 1;

    const requestedCount = options?.maxResults ?? appPage * DISCOVER_PAGE_SIZE;

    const uniqueShows = new Map<number, TvShow>();

    let tmdbPage = 1;
    let totalResults = 0;
    let totalPages = 1;

    while (
      uniqueShows.size < requestedCount &&
      tmdbPage <= 500 &&
      tmdbPage <= totalPages
    ) {
      const result = await discover(toTmdbDiscoverParams(filters, tmdbPage));

      totalResults = result.total_results;

      totalPages = result.total_pages;

      for (const item of result.results) {
        const show = mapTmdbTv(item);

        uniqueShows.set(show.tmdbId, show);
      }

      if (tmdbPage >= totalPages) {
        break;
      }

      tmdbPage += 1;
    }

    return {
      media: Array.from(uniqueShows.values()),
      page: appPage,
      totalResults,
      totalPages: Math.max(1, Math.ceil(totalResults / DISCOVER_PAGE_SIZE)),
    };
  },
};

function toTmdbDiscoverParams(filters: TvDiscoverFilters, page: number) {
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
          firstAirDateGte: `${filters.yearFrom}-01-01`,
        }
      : {}),

    ...(filters.yearTo !== undefined
      ? {
          firstAirDateLte: `${filters.yearTo}-12-31`,
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
