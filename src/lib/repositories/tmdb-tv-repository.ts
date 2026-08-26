import {
  discoverTv,
  getTrendingTv,
  getTvDetails,
  searchTv,
} from '@/lib/tmdb/client';
import { mapTmdbTv, mapTmdbTvDetails } from '@/lib/tmdb/mapper';

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
      page: 1,
      sortBy: 'popularity.desc',
    });

    return result.results.map(mapTmdbTv);
  },

  async getTopRated() {
    const result = await discoverTv({
      page: 1,
      sortBy: 'vote_average.desc',
      minRating: 8,
    });

    return result.results
      .map(mapTmdbTv)
      .filter((show) => show.voteCount >= 1000);
  },

  async search(query) {
    const result = await searchTv(query);

    return result.results.map(mapTmdbTv);
  },

  async discover(filters) {
    const result = await discoverTv(filters);

    return {
      shows: result.results.map(mapTmdbTv),
      page: result.page,
      totalPages: result.total_pages,
      totalResults: result.total_results,
    };
  },
};
