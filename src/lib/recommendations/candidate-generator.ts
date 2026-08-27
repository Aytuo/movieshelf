import type { Movie } from '@/lib/media';
import { movieRepository } from '@/lib/repositories';

export type RecommendationCandidate = {
  movie: Movie;
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
      movie: await movieRepository.getById(seed.tmdbId),
    }))
  );

  const candidates = new Map<number, RecommendationCandidate>();

  for (const { seed, movie } of details) {
    if (!movie) {
      continue;
    }

    addCandidates(
      candidates,
      movie.similar.filter((item): item is Movie => item.type === 'movie'),
      seed,
      1
    );

    addCandidates(
      candidates,
      movie.recommendations.filter(
        (item): item is Movie => item.type === 'movie'
      ),
      seed,
      0.85
    );
  }

  return Array.from(candidates.values());
}

function addCandidates(
  target: Map<number, RecommendationCandidate>,
  movies: Movie[],
  seed: SeedMovie,
  sourceWeight: number
) {
  movies.forEach((movie, index) => {
    const rankScore = Math.max(0, 1 - index / Math.max(movies.length, 1));

    const similarityScore = rankScore * sourceWeight;

    const existing = target.get(movie.tmdbId);

    if (!existing) {
      target.set(movie.tmdbId, {
        movie,
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
