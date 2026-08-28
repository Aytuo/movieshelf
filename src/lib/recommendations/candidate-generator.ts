import type { Media } from '@/lib/media';
import { tmdbMovieRepository } from '@/lib/repositories';

export type RecommendationCandidate = {
  media: Media;
  similarityScore: number;
  sourceMovieId: number | null;
};

type SeedMovie = {
  tmdbId: number;
  rating: number;
};

export async function generateCandidates(
  seeds: SeedMovie[]
): Promise<RecommendationCandidate[]> {
  const limitedSeeds = seeds.slice(0, 3);

  if (limitedSeeds.length === 0) {
    return [];
  }

  const details = await Promise.all(
    limitedSeeds.map(async (seed) => ({
      seed,
      media: await tmdbMovieRepository.getById(seed.tmdbId),
    }))
  );

  const candidates = new Map<number, RecommendationCandidate>();

  for (const { seed, media } of details) {
    if (!media) {
      continue;
    }

    addCandidates(candidates, media.similar, seed, 1);

    addCandidates(candidates, media.recommendations, seed, 0.85);
  }

  return Array.from(candidates.values());
}

function addCandidates(
  target: Map<number, RecommendationCandidate>,
  media: Media[],
  seed: SeedMovie,
  sourceWeight: number
) {
  media.forEach((item, index) => {
    const rankScore = Math.max(0, 1 - index / Math.max(media.length, 1));

    const similarityScore = rankScore * sourceWeight;

    const existing = target.get(item.tmdbId);

    if (!existing) {
      target.set(item.tmdbId, {
        media: item,
        similarityScore,
        sourceMovieId: seed.tmdbId,
      });

      return;
    }

    existing.similarityScore = Math.min(
      existing.similarityScore + similarityScore,
      1
    );
  });
}
