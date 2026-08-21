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
}

export {};
