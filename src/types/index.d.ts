declare global {
  type NavLink = {
    label: string;
    href: string;
    icon?: string;
  };

  export type User = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined | undefined;
  };

  export type Profile = {
    userId: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    onboardingCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;

  export type Movie = {
    id: number;
    title: string;
    originalTitle: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string;
    runtime: number | null;
    genres: string[];
    originalLanguage: string;
    rating: number;
    voteCount: number;
    tagline?: string;
  };

  export type MovieCastMember = {
    id: number;
    name: string;
    character: string;
    profilePath: string | null;
    order: number;
  };

  export type MovieCrewMember = {
    id: number;
    name: string;
    job: string;
    department: string;
    profilePath: string | null;
  };

  export type MovieVideo = {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  };

  export type MovieDetails = Movie & {
    cast: MovieCastMember[];
    crew: MovieCrewMember[];
    videos: MovieVideo[];
    similar: Movie[];
    recommendations: Movie[];
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
    getById(id: number): Promise<MovieDetails | null>;
    getPopular(): Promise<Movie[]>;
    getTrending(): Promise<Movie[]>;
    search(query: string): Promise<Movie[]>;
    discover(
      filters: DiscoverFilters,
      options?: {
        maxMovies?: number;
      }
    ): Promise<{
      movies: Movie[];
      page: number;
      totalPages: number;
      totalResults: number;
    }>;
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

  export type TmdbCreditCast = {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  };

  export type TmdbCreditCrew = {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  };

  export type TmdbCreditsResponse = {
    id: number;
    cast: TmdbCreditCast[];
    crew: TmdbCreditCrew[];
  };

  export type TmdbVideo = {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
  };

  export type TmdbVideosResponse = {
    id: number;
    results: TmdbVideo[];
  };

  export type TmdbMovieBundle = TmdbMovieDetails & {
    credits?: TmdbCreditsResponse;
    videos?: TmdbVideosResponse;
    similar?: TmdbPagedResponse<TmdbMovieResult>;
    recommendations?: TmdbPagedResponse<TmdbMovieResult>;
  };

  export type TmdbTrendingResponse = {
    page: number;
    results: TmdbMovieResult[];
    total_pages: number;
    total_results: number;
  };

  export type TasteGenre = {
    name: string;
    count: number;
    percentage: number;
  };

  export type TasteDecade = {
    decade: string;
    count: number;
    percentage: number;
  };

  export type RatingDistributionItem = {
    rating: number;
    count: number;
  };

  export type TasteProfile = {
    totalMovies: number;
    watchedMovies: number;
    watchlistMovies: number;
    favoriteMovies: number;
    ratedMovies: number;
    averageRating: number | null;
    topGenres: TasteGenre[];
    favoriteDecades: TasteDecade[];
    ratingDistribution: RatingDistributionItem[];
    highestRatedMovies: {
      id: string;
      tmdbId: number;
      title: string;
      posterPath: string | null;
      rating: number;
    }[];
    lowestRatedMovies: {
      id: string;
      tmdbId: number;
      title: string;
      posterPath: string | null;
      rating: number;
    }[];
  };

  export type RecommendationReason =
    'because-you-liked' | 'matches-your-taste' | 'explore';

  export type MovieRecommendation = {
    movie: Movie;
    score: number;
    reason: string;
    reasonType: RecommendationReason;
  };

  export type DiscoverSort =
    | 'popularity.desc'
    | 'vote_average.desc'
    | 'primary_release_date.desc'
    | 'primary_release_date.asc'
    | 'vote_count.desc';

  export type DiscoverFilters = {
    genre?: number;
    yearFrom?: number;
    yearTo?: number;
    minRating?: number;
    maxRating?: number;
    minRuntime?: number;
    maxRuntime?: number;
    language?: string;
    sortBy?: DiscoverSort;
    page?: number;
    hideOnShelf?: boolean;
  };
}

export {};
