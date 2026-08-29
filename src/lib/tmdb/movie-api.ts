import { tmdbFetch } from './client';
import type {
  TmdbMovieBundle,
  TmdbMovieResult,
  TmdbPagedResponse,
  TmdbTrendingResponse,
} from './types';

export type TmdbMovieDiscoverParams = {
  page?: number;
  language?: string;
  region?: string;

  includeAdult?: boolean;
  includeVideo?: boolean;

  sortBy?: string;

  withGenres?: string;
  withoutGenres?: string;

  primaryReleaseDateGte?: string;
  primaryReleaseDateLte?: string;

  voteAverageGte?: number;
  voteAverageLte?: number;
  voteCountGte?: number;

  runtimeGte?: number;
  runtimeLte?: number;

  originalLanguage?: string;

  withReleaseType?: string;
};

function toQueryParams(
  params: TmdbMovieDiscoverParams
): Record<string, string> {
  return {
    page: String(params.page ?? 1),
    language: params.language ?? 'en-US',
    include_adult: String(params.includeAdult ?? false),
    include_video: String(params.includeVideo ?? false),

    ...(params.region ? { region: params.region } : {}),

    ...(params.sortBy ? { sort_by: params.sortBy } : {}),

    ...(params.withGenres ? { with_genres: params.withGenres } : {}),

    ...(params.withoutGenres ? { without_genres: params.withoutGenres } : {}),

    ...(params.primaryReleaseDateGte
      ? {
          'primary_release_date.gte': params.primaryReleaseDateGte,
        }
      : {}),

    ...(params.primaryReleaseDateLte
      ? {
          'primary_release_date.lte': params.primaryReleaseDateLte,
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

    ...(params.withReleaseType
      ? {
          with_release_type: params.withReleaseType,
        }
      : {}),
  };
}

export async function getMovie(id: number) {
  return tmdbFetch<TmdbMovieBundle>(`/movie/${id}`, {
    language: 'en-US',
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getPopular(page = 1, region = 'US') {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/movie/popular', {
    page: String(page),
    language: 'en-US',
    region,
  });
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<TmdbTrendingResponse>(`/trending/movie/${timeWindow}`, {
    language: 'en-US',
  });
}

export async function search(query: string, page = 1, year?: number) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/search/movie', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',

    ...(year
      ? {
          primary_release_year: String(year),
        }
      : {}),
  });
}

export async function discover(params: TmdbMovieDiscoverParams) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>(
    '/discover/movie',
    toQueryParams(params)
  );
}
