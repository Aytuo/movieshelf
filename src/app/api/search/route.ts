import { auth } from '@/lib/auth';
import { search } from '@/lib/services/search-service';
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
      media: [],
      totalResults: 0,
    });
  }

  try {
    const result = await search({
      query,
      filters: {
        type: 'all',
        page: 1,
      },
    });

    return NextResponse.json({
      media: result.media.slice(0, 6),
      totalResults: result.totalResults,
    });
  } catch {
    return NextResponse.json(
      {
        error: 'Unable to search.',
      },
      {
        status: 500,
      }
    );
  }
}
