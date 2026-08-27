/* ========================================================================== */
/*                              COMMON TMDB TYPES                             */
/* ========================================================================== */

export type TmdbPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

/* ========================================================================== */
/*                               MOVIE TYPES                                  */
/* ========================================================================== */

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

export type TmdbTrendingResponse = TmdbPagedResponse<TmdbMovieResult>;

/* ========================================================================== */
/*                                TV TYPES                                    */
/* ========================================================================== */

export type TmdbTvResult = {
  id: number;
  name: string;
  original_name: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  genre_ids?: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
};

export type TmdbTvDetails = {
  id: number;
  name: string;
  original_name: string;
  overview: string | null;
  tagline: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string | null;
  genres: {
    id: number;
    name: string;
  }[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string | null;
  seasons: TmdbTvSeason[];
  created_by: TmdbTvCreator[];
};

export type TmdbTvSeason = {
  id: number;
  name: string;
  overview: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
};

export type TmdbTvCreator = {
  id: number;
  name: string;
  profile_path: string | null;
};

export type TmdbTvAggregateCast = {
  id: number;
  name: string;
  profile_path: string | null;
  roles?: {
    character: string;
    episode_count: number;
  }[];
  total_episode_count?: number;
};

export type TmdbTvAggregateCredits = {
  id: number;
  cast: TmdbTvAggregateCast[];
};

export type TmdbTvBundle = TmdbTvDetails & {
  aggregate_credits?: TmdbTvAggregateCredits;
  videos?: TmdbVideosResponse;
  similar?: TmdbPagedResponse<TmdbTvResult>;
  recommendations?: TmdbPagedResponse<TmdbTvResult>;
};

/* ========================================================================== */
/*                             MULTI SEARCH                                   */
/* ========================================================================== */

export type TmdbPersonResult = {
  id: number;
  name: string;
  original_name?: string;
  profile_path: string | null;
  known_for_department: string | null;
  popularity: number;
};

export type TmdbMultiSearchMovieResult = TmdbMovieResult & {
  media_type: 'movie';
};

export type TmdbMultiSearchTvResult = TmdbTvResult & {
  media_type: 'tv';
};

export type TmdbMultiSearchPersonResult = TmdbPersonResult & {
  media_type: 'person';
};

export type TmdbMultiSearchResult =
  | TmdbMultiSearchMovieResult
  | TmdbMultiSearchTvResult
  | TmdbMultiSearchPersonResult;

export type TmdbMultiSearchResponse = TmdbPagedResponse<TmdbMultiSearchResult>;
