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

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/search/movie', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}

export async function getMovieDetails(movieId: number) {
  return tmdbFetch<TmdbMovieDetails>(`/movie/${movieId}`, {
    language: 'en-US',
  });
}

export async function discoverMovies(page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>('/discover/movie', {
    page: String(page),
    language: 'en-US',
    sort_by: 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
  });
}
