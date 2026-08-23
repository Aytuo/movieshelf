import { movieRepository } from '@/lib/repositories';

export async function getColdStartRecommendations() {
  const movies = await movieRepository.getPopular();

  return movies.slice(0, 12).map<MovieRecommendation>((movie) => ({
    movie,

    score: 0,

    reason: 'Popular on MovieShelf',

    reasonType: 'explore',
  }));
}
