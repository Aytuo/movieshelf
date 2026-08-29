const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const token = process.env.TMDB_API_READ_ACCESS_TOKEN;

if (!token) {
  throw new Error('TMDB_API_READ_ACCESS_TOKEN is not configured.');
}

export async function tmdbFetch<T>(
  path: string,
  searchParams?: Record<string, string>
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== '') {
        url.searchParams.set(key, value);
      }
    }
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
