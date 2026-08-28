import { tmdbMovieRepository } from '@/lib/repositories';

export async function getOnboardingCandidates() {
  const [popular, trending] = await Promise.all([
    tmdbMovieRepository.getPopular(),
    tmdbMovieRepository.getTrending(),
  ]);

  const movies = new Map(
    [...popular, ...trending].map((movie) => [movie.tmdbId, movie])
  );

  return Array.from(movies.values()).slice(0, 24);
}
