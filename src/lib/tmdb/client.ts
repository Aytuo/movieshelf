import 'server-only';

type TmdbFetchOptions = {
  revalidate?: number | false;
};

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

if (!token) {
  throw new Error('TMDB_API_READ_ACCESS_TOKEN is not configured.');
}

export async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string>,
  options: TmdbFetchOptions = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== '') {
        url.searchParams.set(key, value);
      }
    }
  }

  const cacheOptions =
    options.revalidate === false
      ? { cache: 'no-store' as const }
      : { next: { revalidate: options.revalidate ?? 300 } };

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    },
    ...cacheOptions,
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}
