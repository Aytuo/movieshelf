import { refreshMediaRatings } from '@/lib/services/media-rating-sync-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    console.error('CRON_SECRET is not configured.');

    return NextResponse.json(
      { error: 'Server configuration error.' },
      { status: 500 }
    );
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const result = await refreshMediaRatings();

    return NextResponse.json(result);
  } catch (error) {
    console.error('[media-rating-sync] Cron run failed:', error);

    return NextResponse.json(
      { error: 'Rating refresh failed.' },
      { status: 500 }
    );
  }
}
