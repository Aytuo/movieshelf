import { MovieDiscoverFilters, TvDiscoverFilters } from '@/types';
import {
  TmdbMovieBundle,
  TmdbMovieResult,
  TmdbMultiSearchResult,
  TmdbPagedResponse,
  TmdbPersonResult,
  TmdbTrendingResponse,
  TmdbTvBundle,
  TmdbTvResult,
} from './types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

if (!token) {
  throw new Error('TMDB_API_READ_ACCESS_TOKEN is not configured.');
}

async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string>
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<TmdbTrendingResponse>(`/trending/movie/${timeWindow}`, {
    language: 'en-US',
  });
}

export async function searchMovies(
  query: string,
  page = 1,
  options?: {
    year?: number;
  }
) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/search/movie', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',

    ...(options?.year
      ? {
          primary_release_year: String(options.year),
        }
      : {}),
  });
}

export async function discoverMovies(filters: MovieDiscoverFilters = {}) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(filters.page ?? 1),
    language: 'en-US',

    include_adult: 'false',
    include_video: 'false',

    sort_by: filters.sortBy ?? 'popularity.desc',

    ...(filters.genre
      ? {
          with_genres: String(filters.genre),
        }
      : {}),

    ...(filters.yearFrom
      ? {
          'primary_release_date.gte': `${filters.yearFrom}-01-01`,
        }
      : {}),

    ...(filters.yearTo
      ? {
          'primary_release_date.lte': `${filters.yearTo}-12-31`,
        }
      : {}),

    ...(filters.minRating !== undefined
      ? {
          'vote_average.gte': String(filters.minRating),
        }
      : {}),

    ...(filters.maxRating !== undefined
      ? {
          'vote_average.lte': String(filters.maxRating),
        }
      : {}),

    ...(filters.minVoteCount !== undefined
      ? {
          'vote_count.gte': String(filters.minVoteCount),
        }
      : {}),

    ...(filters.minRuntime !== undefined
      ? {
          'with_runtime.gte': String(filters.minRuntime),
        }
      : {}),

    ...(filters.maxRuntime !== undefined
      ? {
          'with_runtime.lte': String(filters.maxRuntime),
        }
      : {}),

    ...(filters.language
      ? {
          with_original_language: filters.language,
        }
      : {}),
  });
}

export async function getMovieDetails(movieId: number) {
  return tmdbFetch<TmdbMovieBundle>(`/movie/${movieId}`, {
    language: 'en-US',
    append_to_response: 'credits,videos,similar,recommendations',
  });
}

export async function getRecommendedMoviesByTmdb(
  page: number = 1,
  region: string = 'US'
) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(page),
    language: 'en-US',
    region,
    sort_by: 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
    'vote_average.gte': '7.0',
    'vote_count.gte': '250',
  });
}

export async function getTopPicksMovies(
  page: number = 1,
  region: string = 'US'
) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(page),
    language: 'en-US',
    region,
    sort_by: 'vote_average.desc',
    include_adult: 'false',
    include_video: 'false',
    'vote_average.gte': '7.5',
    'vote_count.gte': '500',
  });
}

export async function getNowPlayingMovies(
  page: number = 1,
  region: string = 'US'
) {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - 42);

  const minDate = pastDate.toISOString().split('T')[0];
  const maxDate = today.toISOString().split('T')[0];

  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(page),
    language: 'en-US',
    region,
    sort_by: 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
    with_release_type: '2|3',
    'primary_release_date.gte': minDate,
    'primary_release_date.lte': maxDate,
  });
}

export async function getUpcomingMovies(
  page: number = 1,
  region: string = 'US'
) {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setMonth(today.getMonth() + 3);

  const minDate = today.toISOString().split('T')[0];
  const maxDate = futureDate.toISOString().split('T')[0];

  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(page),
    language: 'en-US',
    region,
    sort_by: 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
    with_release_type: '2|3',
    'primary_release_date.gte': minDate,
    'primary_release_date.lte': maxDate,
  });
}

export async function getPopularMovies(
  page: number = 1,
  region: string = 'US'
) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/movie/popular', {
    page: String(page),
    language: 'en-US',
    region,
  });
}

export async function getTopRatedMovies(
  page: number = 1,
  region: string = 'US'
) {
  const today = new Date().toISOString().split('T')[0];

  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(page),
    language: 'en-US',
    region,
    sort_by: 'vote_average.desc',
    include_adult: 'false',
    include_video: 'false',
    without_genres: '99,10755',
    'vote_count.gte': '10000',
    'primary_release_date.lte': today,
  });
}

// TV Series
export async function getTrendingTv(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>(
    `/trending/tv/${timeWindow}`,
    {
      language: 'en-US',
    }
  );
}

export async function searchTv(
  query: string,
  page = 1,
  options?: {
    year?: number;
  }
) {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>('/search/tv', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',

    ...(options?.year
      ? {
          first_air_date_year: String(options.year),
        }
      : {}),
  });
}

export async function discoverTv(filters: TvDiscoverFilters = {}) {
  return tmdbFetch<TmdbPagedResponse<TmdbTvResult>>('/discover/tv', {
    page: String(filters.page ?? 1),
    language: 'en-US',
    include_adult: 'false',
    include_null_first_air_dates: 'false',

    sort_by: filters.sortBy ?? 'popularity.desc',

    ...(filters.genre
      ? {
          with_genres: String(filters.genre),
        }
      : {}),

    ...(filters.yearFrom
      ? {
          'first_air_date.gte': `${filters.yearFrom}-01-01`,
        }
      : {}),

    ...(filters.yearTo
      ? {
          'first_air_date.lte': `${filters.yearTo}-12-31`,
        }
      : {}),

    ...(filters.minRating !== undefined
      ? {
          'vote_average.gte': String(filters.minRating),
        }
      : {}),

    ...(filters.maxRating !== undefined
      ? {
          'vote_average.lte': String(filters.maxRating),
        }
      : {}),

    ...(filters.minRuntime !== undefined
      ? {
          'with_runtime.gte': String(filters.minRuntime),
        }
      : {}),

    ...(filters.maxRuntime !== undefined
      ? {
          'with_runtime.lte': String(filters.maxRuntime),
        }
      : {}),

    ...(filters.language
      ? {
          with_original_language: filters.language,
        }
      : {}),
  });
}

export async function getTvDetails(tvId: number) {
  return tmdbFetch<TmdbTvBundle>(`/tv/${tvId}`, {
    language: 'en-US',
    append_to_response: 'aggregate_credits,videos,similar,recommendations',
  });
}

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbMultiSearchResult>>('/search/multi', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}

export async function searchPeople(query: string, page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbPersonResult>>('/search/person', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}
