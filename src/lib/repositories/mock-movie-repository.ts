import { MOCK_MOVIES } from '@/constants';
import { TMDB_MOVIES_GENRES } from '../tmdb/genres';

export const mockMovieRepository: MovieRepository = {
  async getById(id) {
    const movie = MOCK_MOVIES.find((movie) => movie.id === id);

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
      const genreName = Object.entries(TMDB_MOVIES_GENRES).find(
        ([id]) => Number(id) === filters.genre
      )?.[1];

      if (genreName) {
        movies = movies.filter((movie) => movie.genres.includes(genreName));
      }
    }

    if (filters.minRating !== undefined) {
      movies = movies.filter((movie) => movie.rating >= filters.minRating!);
    }

    if (filters.maxRating !== undefined) {
      movies = movies.filter((movie) => movie.rating <= filters.maxRating!);
    }

    return {
      movies,
      page: 1,
      totalPages: 1,
      totalResults: movies.length,
    };
  },
};
