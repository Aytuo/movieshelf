/* ========================================================================== */
/*                                DISCOVER                                    */
/* ========================================================================== */

export type MoviesDiscoverSort =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'vote_count.desc';

export type TvDiscoverSort =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'first_air_date.desc'
  | 'first_air_date.asc'
  | 'vote_count.desc';

export interface MoviesDiscoverFilters {
  genre?: number;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  maxRating?: number;
  minRuntime?: number;
  maxRuntime?: number;
  minVoteCount?: number;
  language?: string;
  sortBy?: MoviesDiscoverSort;
  page?: number;
  hideOnShelf?: boolean;
}

export type TvDiscoverFilters = {
  genre?: number;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  maxRating?: number;
  minRuntime?: number;
  maxRuntime?: number;
  language?: string;
  sortBy?: TvDiscoverSort;
  page?: number;
};
