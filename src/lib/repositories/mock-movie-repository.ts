import { MOCK_MOVIES } from '@/constants';
import { MovieRepository } from './types';

export const mockMovieRepository: MovieRepository = {
  async getById(id) {
    const movie = MOCK_MOVIES.find((movie) => movie.tmdbId === id);

    if (!movie) {
      return null;
    }

    return {
      ...movie,
      cast: [],
      crew: [],
      videos: [],
      similar: [],
      recommendations: [],
    };
  },

  async getPopular() {
    return MOCK_MOVIES;
  },

  async getTrending() {
    return MOCK_MOVIES.slice(0, 5);
  },

  async getTopPicks() {
    return MOCK_MOVIES;
  },

  async getUpcoming() {
    return MOCK_MOVIES;
  },

  async search(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return MOCK_MOVIES.filter((movie) =>
      movie.title.toLowerCase().includes(normalized)
    );
  },

  async discover(filters) {
    let movies = [...MOCK_MOVIES];

    if (filters.genre) {
      movies = movies.filter((movie) =>
        movie.genres.some((genre) => genre.id === filters.genre)
      );
    }

    if (filters.yearFrom) {
      movies = movies.filter((movie) => {
        if (!movie.releaseDate) {
          return false;
        }

        const year = Number(movie.releaseDate.slice(0, 4));

        return year >= filters.yearFrom!;
      });
    }

    if (filters.yearTo) {
      movies = movies.filter((movie) => {
        if (!movie.releaseDate) {
          return false;
        }

        const year = Number(movie.releaseDate.slice(0, 4));

        return year <= filters.yearTo!;
      });
    }

    if (filters.minRating !== undefined) {
      movies = movies.filter((movie) => movie.rating >= filters.minRating!);
    }

    if (filters.maxRating !== undefined) {
      movies = movies.filter((movie) => movie.rating <= filters.maxRating!);
    }

    if (filters.language) {
      movies = movies.filter(
        (movie) => movie.originalLanguage === filters.language
      );
    }

    return {
      movies,
      page: filters.page ?? 1,
      totalResults: movies.length,
      totalPages: 1,
    };
  },
};
