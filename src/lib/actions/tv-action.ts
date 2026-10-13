'use server';

import { requireSession } from '@/lib/auth/require-session';
import type { TvSeasonDetails } from '@/lib/media';
import { getTvSeason } from '@/lib/services/media-service';
import { z } from 'zod';

const tvSeasonRequestSchema = z.object({
  tvId: z.number().int().positive(),
  seasonNumber: z.number().int().nonnegative(),
});

export async function getTvSeasonAction(
  tvId: number,
  seasonNumber: number
): Promise<TvSeasonDetails> {
  await requireSession();

  const parsed = tvSeasonRequestSchema.safeParse({
    tvId,
    seasonNumber,
  });

  if (!parsed.success) {
    throw new Error('Invalid TV season request.');
  }

  return getTvSeason(parsed.data.tvId, parsed.data.seasonNumber);
}
