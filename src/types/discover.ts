/* ========================================================================== */
/*                                DISCOVER                                    */
/* ========================================================================== */

import { Media } from '@/lib/media';

export type MovieDiscoverSort =
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

/* -------------------------------------------------------------------------- */
/*                           SHARED FILTERS                                   */
/* -------------------------------------------------------------------------- */

export type DiscoverMediaType = 'movie' | 'tv';

export interface BaseDiscoverFilters {
  type: DiscoverMediaType;
  genre?: number;
  yearFrom?: number;
  yearTo?: number;
  minRating?: number;
  maxRating?: number;
  minRuntime?: number;
  maxRuntime?: number;
  language?: string;
  page?: number;
  minVoteCount?: number;
  hideOnShelf?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                       MEDIA-SPECIFIC FILTERS                               */
/* -------------------------------------------------------------------------- */

export interface DiscoverResult {
  media: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface DiscoverOptions {
  maxResults?: number;
}

export interface MovieDiscoverFilters extends BaseDiscoverFilters {
  type: 'movie';
  sortBy?: MovieDiscoverSort;
}

export interface TvDiscoverFilters extends BaseDiscoverFilters {
  type: 'tv';
  sortBy?: TvDiscoverSort;
}

/* -------------------------------------------------------------------------- */
/*                         APPLICATION FILTERS                                */
/* -------------------------------------------------------------------------- */

export type DiscoverFilters = MovieDiscoverFilters | TvDiscoverFilters;
