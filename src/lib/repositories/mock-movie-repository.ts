import { MOCK_MOVIES } from '@/constants';

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
};
