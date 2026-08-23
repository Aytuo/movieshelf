import { auth } from '@/lib/auth';
import { searchMovies } from '@/lib/tmdb/client';
import { mapTmdbMovie } from '@/lib/tmdb/mapper';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const url = new URL(request.url);

  const query = url.searchParams.get('q')?.trim() ?? '';

  if (query.length < 2) {
    return NextResponse.json({
      movies: [],
      totalResults: 0,
    });
  }

  try {
    const response = await searchMovies(query, 1);

    const movies = response.results.slice(0, 6).map(mapTmdbMovie);

    return NextResponse.json({
      movies,
      totalResults: response.total_results,
    });
  } catch {
    return NextResponse.json(
      {
        error: 'Unable to search movies.',
      },
      {
        status: 500,
      }
    );
  }
}
