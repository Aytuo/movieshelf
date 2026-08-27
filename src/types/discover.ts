/* ========================================================================== */
/*                                DISCOVER                                    */
/* ========================================================================== */

export type DiscoverSort =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'primary_release_date.desc'
  | 'primary_release_date.asc'
  | 'vote_count.desc';

export interface DiscoverFilters {
  genre?: number;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  maxRating?: number;
  minRuntime?: number;
  maxRuntime?: number;
  minVoteCount?: number;
  language?: string;
  sortBy?: DiscoverSort;
  page?: number;
  hideOnShelf?: boolean;
}
