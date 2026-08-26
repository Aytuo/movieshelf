export type TvDiscoverSort =
  | 'popularity.desc'
  | 'vote_average.desc'
  | 'first_air_date.desc'
  | 'first_air_date.asc'
  | 'vote_count.desc';

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
  hideOnShelf?: boolean;
};
