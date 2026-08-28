import { tmdbMovieRepository } from '@/lib/repositories';

export async function searchForMovies(query: string) {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  return tmdbMovieRepository.search(trimmed);
}
