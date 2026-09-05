import { tmdbFetch } from './client';
import type {
  TmdbPagedResponse,
  TmdbTvBundle,
  TmdbTvEpisode,
  TmdbTvResult,
  TmdbTvSeasonDetails,
} from './types';

export type TmdbTvDiscoverParams = {
  page?: number;
  language?: string;

  includeAdult?: boolean;
  includeNullFirstAirDates?: boolean;

  sortBy?: string;

  withGenres?: string;

  firstAirDateGte?: string;
  firstAirDateLte?: string;

  airDateGte?: string;
  airDateLte?: string;

  voteAverageGte?: number;
  voteAverageLte?: number;
  voteCountGte?: number;

  runtimeGte?: number;
  runtimeLte?: number;

  originalLanguage?: string;

  withStatus?: string;
  withType?: string;

  timezone?: string;
};

function toQueryParams(params: TmdbTvDiscoverParams): Record<string, string> {
  return {
    page: String(params.page ?? 1),
    language: params.language ?? 'en-US',
    include_adult: String(params.includeAdult ?? false),
    include_null_first_air_dates: String(
      params.includeNullFirstAirDates ?? false
    ),

    ...(params.sortBy ? { sort_by: params.sortBy } : {}),

    ...(params.withGenres ? { with_genres: params.withGenres } : {}),

    ...(params.firstAirDateGte
      ? {
          'first_air_date.gte': params.firstAirDateGte,
        }
      : {}),

    ...(params.firstAirDateLte
      ? {
          'first_air_date.lte': params.firstAirDateLte,
        }
      : {}),

    ...(params.airDateGte
      ? {
          'air_date.gte': params.airDateGte,
        }
      : {}),

    ...(params.airDateLte
      ? {
          'air_date.lte': params.airDateLte,
        }
      : {}),

    ...(params.voteAverageGte !== undefined
      ? {
          'vote_average.gte': String(params.voteAverageGte),
        }
      : {}),

    ...(params.voteAverageLte !== undefined
      ? {
          'vote_average.lte': String(params.voteAverageLte),
        }
      : {}),

    ...(params.voteCountGte !== undefined
      ? {
          'vote_count.gte': String(params.voteCountGte),
        }
      : {}),

    ...(params.runtimeGte !== undefined
      ? {
          'with_runtime.gte': String(params.runtimeGte),
        }
      : {}),

    ...(params.runtimeLte !== undefined
      ? {
          'with_runtime.lte': String(params.runtimeLte),
        }
      : {}),

    ...(params.originalLanguage
      ? {
          with_original_language: params.originalLanguage,
        }
      : {}),

    ...(params.withStatus
      ? {
          with_status: params.withStatus,
        }
      : {}),

    ...(params.withType
      ? {
          with_type: params.withType,
        }
      : {}),

    ...(params.timezone
      ? {
          timezone: params.timezone,
        }
      : {}),
  };
}

export async function getTv(id: number) {
  return tmdbFetch<TmdbTvBundle>(`/tv/${id}`, {
    language: 'en-US',
    append_to_response: 'aggregate_credits,videos,similar,recommendations',
  });
}

export async function getPopular(page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>('/tv/popular', {
    page: String(page),
    language: 'en-US',
  });
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>(
    `/trending/tv/${timeWindow}`,
    {
      language: 'en-US',
    }
  );
}

export async function getSeason(tvId: number, seasonNumber: number) {
  return tmdbFetch<TmdbTvSeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`, {
    language: 'en-US',
  });
}

export async function getEpisode(
  tvId: number,
  seasonNumber: number,
  episodeNumber: number
) {
  return tmdbFetch<TmdbTvEpisode>(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,
    {
      language: 'en-US',
    }
  );
}

export async function search(query: string, page = 1, year?: number) {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>('/search/tv', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',

    ...(year
      ? {
          first_air_date_year: String(year),
        }
      : {}),
  });
}

export async function discover(params: TmdbTvDiscoverParams) {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>(
    '/discover/tv',
    toQueryParams(params)
  );
}
