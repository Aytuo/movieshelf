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

export async function discoverMovies(filters: DiscoverFilters = {}) {
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
