import type { Movie } from '@/lib/media';
import { MovieDiscoverFilters } from '@/types';

function getYear(releaseDate: string | null) {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

export function filterMovies(
  movies: Movie[],
  filters: MovieDiscoverFilters
): Movie[] {
  return movies.filter((movie) => {
    if (
      filters.genre &&
      !movie.genres.some((genre) => genre.id === filters.genre)
    ) {
      return false;
    }

    const year = getYear(movie.releaseDate);

    if (filters.yearFrom && (!year || year < filters.yearFrom)) {
      return false;
    }

    if (filters.yearTo && (!year || year > filters.yearTo)) {
      return false;
    }

    if (filters.minRating !== undefined && movie.rating < filters.minRating) {
      return false;
    }

    if (filters.maxRating !== undefined && movie.rating > filters.maxRating) {
      return false;
    }

    if (filters.language && movie.originalLanguage !== filters.language) {
      return false;
    }

    return true;
  });
}
