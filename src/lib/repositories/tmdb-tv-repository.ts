import {
  discoverTv,
  getTrendingTv,
  getTvDetails,
  searchTv,
} from '@/lib/tmdb/client';
import { mapTmdbTv, mapTmdbTvDetails } from '@/lib/tmdb/mapper';
import { DISCOVER_PAGE_SIZE } from '../discover/pagination';
import { TvShow } from '../media';
import { TvRepository } from './types';

export const tmdbTvRepository: TvRepository = {
  async getById(id) {
    const result = await getTvDetails(id);

    return mapTmdbTvDetails(result);
  },

  async getTrending() {
    const result = await getTrendingTv('week');

    return result.results.map(mapTmdbTv);
  },

  async getPopular() {
    const result = await discoverTv({
      type: 'tv',
      page: 1,
      sortBy: 'popularity.desc',
    });

    return result.results.map(mapTmdbTv);
  },

  async getTopRated() {
    const result = await discoverTv({
      type: 'tv',
      page: 1,
      sortBy: 'vote_average.desc',
      minRating: 8,
    });

    return result.results
      .map(mapTmdbTv)
      .filter((show) => show.voteCount >= 1000);
  },

  async search(query, options) {
    const page = options?.page ?? 1;

    const response = await searchTv(query, page);

    return {
      media: response.results.map(mapTmdbTv),
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
    };
  },

  async discover(filters, options) {
    const appPage = filters.page ?? 1;

    const requestedCount = options?.maxResults ?? appPage * DISCOVER_PAGE_SIZE;

    const uniqueMedia = new Map<number, TvShow>();

    let tmdbPage = 1;
    let totalResults = 0;
    let totalPages = 1;

    while (
      uniqueMedia.size < requestedCount &&
      tmdbPage <= 500 &&
      tmdbPage <= totalPages
    ) {
      const response = await discoverTv({
        ...filters,
        page: tmdbPage,
      });

      totalResults = response.total_results;
      totalPages = response.total_pages;

      for (const result of response.results) {
        const mapped = mapTmdbTv(result);

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
