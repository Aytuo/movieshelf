import { TMDB_MOVIES_GENRES } from '../tmdb/genres';

function getYear(releaseDate: string) {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

export function filterMovies(movies: Movie[], filters: DiscoverFilters) {
  return movies.filter((movie) => {
    if (
      filters.genre &&
      !movie.genres.includes(TMDB_MOVIES_GENRES[filters.genre])
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

    /*
     * Runtime deliberately isn't handled here.
     * TMDB search results don't contain runtime.
     * Discover applies runtime filtering directly
     * through the TMDB API.
     */

    return true;
  });
}
