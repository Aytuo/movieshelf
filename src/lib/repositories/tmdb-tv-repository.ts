import {
  DISCOVER_PAGE_SIZE,
  getReachableDiscoverPageCount,
  getReachableDiscoverResultCount,
} from '@/lib/discover/pagination';
import type {
  TvEpisode,
  TvScheduleItem,
  TvSeasonDetails,
  TvShow,
} from '@/lib/media';
import {
  discover,
  getPopular,
  getSeason,
  getTrending,
  getTv,
  search as searchTv,
} from '@/lib/tmdb/tv-api';
import { TvDiscoverFilters } from '@/types';
import { collectPagedResults } from '../rankings/pagination';
import { paginateSearchItems } from '../search/pagination';
import {
  mapTmdbTv,
  mapTmdbTvDetails,
  mapTmdbTvSeasonDetails,
  mapTvEpisode,
} from '../tmdb/media-mapper';
import { TvRepository } from './types';

const TV_RANKING_MIN_VOTE_COUNT = 2_500;

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
    const result = await getTrending('day');

    return result.results.map(mapTmdbTv);
  },

  async getTopPicks() {
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

    const shows = result.results.map(mapTmdbTv);

    return toScheduleItems(shows, async (showId) => {
      const details = await getTv(showId);

      if (details.last_episode_to_air?.air_date === today) {
        return mapTvEpisode(details.last_episode_to_air);
      }

      if (details.next_episode_to_air?.air_date === today) {
        return mapTvEpisode(details.next_episode_to_air);
      }

      return null;
    });
  },

  async getOnTheAir() {
    const today = new Date();
    const nextWeek = new Date(today);

    nextWeek.setDate(nextWeek.getDate() + 7);

    const todayString = toDateString(today);
    const nextWeekString = toDateString(nextWeek);

    const result = await discover({
      page: 1,
      sortBy: 'popularity.desc',
      airDateGte: todayString,
      airDateLte: nextWeekString,
    });

    const shows = result.results.map(mapTmdbTv);

    return toScheduleItems(shows, async (showId) => {
      const details = await getTv(showId);
      const episode = details.next_episode_to_air;

      if (!episode?.air_date) {
        return null;
      }

      if (episode.air_date < todayString || episode.air_date > nextWeekString) {
        return null;
      }

      return mapTvEpisode(episode);
    });
  },

  async getTopRated() {
    const result = await discover({
      page: 1,
      sortBy: 'vote_average.desc',
      voteCountGte: 10_000,
    });

    return result.results.map(mapTmdbTv);
  },

  async getRankingCandidates() {
    const candidates = await collectPagedResults(
      (page) =>
        discover({
          page,
          sortBy: 'vote_average.desc',
          voteCountGte: TV_RANKING_MIN_VOTE_COUNT,
        }),
      500
    );

    return candidates.map(mapTmdbTv);
  },

  async getSeason(
    tvId: number,
    seasonNumber: number
  ): Promise<TvSeasonDetails> {
    const response = await getSeason(tvId, seasonNumber);

    return mapTmdbTvSeasonDetails(response);
  },

  async search(query, options) {
    const page = options?.page ?? 1;
    const year = options?.year;

    const result = await paginateSearchItems(page, (tmdbPage) =>
      searchTv(query, tmdbPage, year)
    );

    return {
      media: result.items.map(mapTmdbTv),
      page: result.page,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
    };
  },

  async discover(filters, options) {
    const fetchPage = (page: number) =>
      discover(toTmdbDiscoverParams(filters, page));

    const firstResult = await fetchPage(1);

    const totalResults = getReachableDiscoverResultCount(
      firstResult.total_results,
      firstResult.total_pages
    );

    const totalPages = getReachableDiscoverPageCount(
      firstResult.total_results,
      firstResult.total_pages
    );

    const requestedPage = Math.max(
      1,
      Number.isInteger(filters.page) ? (filters.page ?? 1) : 1
    );

    const page = Math.min(requestedPage, totalPages);

    if (options?.maxResults !== undefined) {
      const requestedCount = Math.min(
        totalResults,
        Math.max(0, Math.floor(options.maxResults))
      );

      const uniqueShows = new Map<number, TvShow>();

      for (
        let tmdbPage = 1;
        tmdbPage <= totalPages && uniqueShows.size < requestedCount;
        tmdbPage += 1
      ) {
        const result = tmdbPage === 1 ? firstResult : await fetchPage(tmdbPage);

        for (const item of result.results) {
          const show = mapTmdbTv(item);

          uniqueShows.set(show.tmdbId, show);

          if (uniqueShows.size >= requestedCount) {
            break;
          }
        }
      }

      return {
        media: Array.from(uniqueShows.values()).slice(0, requestedCount),
        page,
        totalResults,
        totalPages,
      };
    }

    const result = page === 1 ? firstResult : await fetchPage(page);

    const uniqueShows = new Map<number, TvShow>();

    for (const item of result.results) {
      const show = mapTmdbTv(item);

      if (!uniqueShows.has(show.tmdbId)) {
        uniqueShows.set(show.tmdbId, show);
      }
    }

    return {
      media: Array.from(uniqueShows.values()).slice(0, DISCOVER_PAGE_SIZE),
      page,
      totalResults,
      totalPages,
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

async function toScheduleItems(
  shows: TvShow[],
  getEpisode: (showId: number) => Promise<TvEpisode | null>
): Promise<TvScheduleItem[]> {
  const results = await Promise.all(
    shows.map(async (show) => {
      const episode = await getEpisode(show.tmdbId);

      if (!episode) {
        return null;
      }

      return {
        media: show,
        episode,
      };
    })
  );

  return results.filter((item): item is TvScheduleItem => item !== null);
}
