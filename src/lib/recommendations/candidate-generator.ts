import type { Media, MediaKey, MediaType } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';

export type RecommendationSeed = {
  tmdbId: number;
  type: MediaType;
  rating: number;
};

export type RecommendationCandidate = {
  media: Media;
  similarityScore: number;
  sourceMediaKey: MediaKey | null;
};

export async function generateCandidates(
  seeds: RecommendationSeed[]
): Promise<RecommendationCandidate[]> {
  const limitedSeeds = seeds.slice(0, 3);

  if (limitedSeeds.length === 0) {
    return [];
  }

  const details = await Promise.all(
    limitedSeeds.map(async (seed) => ({
      seed,
      media: await getRepository(seed.type).getById(seed.tmdbId),
    }))
  );

  const candidates = new Map<string, RecommendationCandidate>();

  for (const { seed, media } of details) {
    if (!media) {
      continue;
    }

    addCandidates(candidates, media.similar, seed, 1);

    addCandidates(candidates, media.recommendations, seed, 0.85);
  }

  return Array.from(candidates.values());
}

function getRepository(type: MediaType) {
  return type === 'movie' ? tmdbMovieRepository : tmdbTvRepository;
}

function addCandidates(
  target: Map<string, RecommendationCandidate>,
  media: Media[],
  seed: RecommendationSeed,
  sourceWeight: number
) {
  media.forEach((item, index) => {
    // Never allow the recommendation engine to cross the Movie / TV boundary.
    if (item.type !== seed.type) {
      return;
    }

    const rankScore = Math.max(0, 1 - index / Math.max(media.length, 1));

    const similarityScore = rankScore * sourceWeight;

    const key = `${item.type}:${item.tmdbId}`;

    const existing = target.get(key);

    if (!existing) {
      target.set(key, {
        media: item,
        similarityScore,
        sourceMediaKey: {
          tmdbId: seed.tmdbId,
          type: seed.type,
        },
      });

      return;
    }

    existing.similarityScore = Math.min(
      existing.similarityScore + similarityScore,
      1
    );
  });
}
