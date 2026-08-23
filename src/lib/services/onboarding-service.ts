import { movieRepository } from '@/lib/repositories';

export async function getOnboardingCandidates() {
  const [popular, trending] = await Promise.all([
    movieRepository.getPopular(),
    movieRepository.getTrending(),
  ]);

  const movies = new Map(
    [...popular, ...trending].map((movie) => [movie.id, movie])
  );

  return Array.from(movies.values()).slice(0, 24);
}
