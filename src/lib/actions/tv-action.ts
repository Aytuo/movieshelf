'use server';

import type { TvSeasonDetails } from '@/lib/media';
import { getTvSeason } from '@/lib/services/media-service';

export async function getTvSeasonAction(
  tvId: number,
  seasonNumber: number
): Promise<TvSeasonDetails> {
  return getTvSeason(tvId, seasonNumber);
}
