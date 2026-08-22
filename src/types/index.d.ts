declare global {
  type NavLink = {
    label: string;
    href: string;
    icon?: string;
  };

  type Movie = {
    id: number;
    title: string;
    originalTitle?: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string;
    runtime: number | null;
    genres: string[];
    rating: number;
    voteCount: number;
    tagline?: string;
    certification?: string;
  };

  type MovieListItem = Pick<Movie, 'id' | 'title' | 'rating' | 'posterPath'>;

  type UserStats = {
    moviesRated: number;
    moviesWatched: number;
    watchlistCount: number;
    favoriteCount: number;
  };

  type ActivityItem = {
    id: string;
    type: 'rating' | 'watchlist' | 'favorite' | 'review';
    movie: MovieListItem;
    value?: number;
    createdAt: string;
  };

  type MovieStatus = 'watched' | 'watchlist';

  type UserMovie = {
    movieId: number;
    status: MovieStatus;
    rating: number | null;
    favorite: boolean;
    watchedAt: string | null;
    addedAt: string;
  };

  export interface MovieRepository {
    getById(id: number): Promise<Movie | null>;

    getPopular(): Promise<Movie[]>;

    getTrending(): Promise<Movie[]>;

    search(query: string): Promise<Movie[]>;
  }

  export type TmdbMovieResult = {
    id: number;
    title: string;
    original_title: string;
    overview: string | null;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    genre_ids?: number[];
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult: boolean;
    original_language: string;
  };

  export type TmdbPagedResponse<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
  };

  export type TmdbMovieDetails = {
    id: number;
    title: string;
    original_title: string;
    overview: string | null;
    tagline: string | null;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    runtime: number | null;
    genres: {
      id: number;
      name: string;
    }[];
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult: boolean;
    original_language: string;
  };

  export type TmdbTrendingResponse = {
    page: number;
    results: TmdbMovieResult[];
    total_pages: number;
    total_results: number;
  };
}

export {};
