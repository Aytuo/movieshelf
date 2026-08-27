import type { Movie, MovieDetails, TvDetails, TvShow } from '@/lib/media';
import { MoviesDiscoverFilters, TvDiscoverFilters } from '@/types';

export interface MovieDiscoverResult {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface TvDiscoverResult {
  shows: TvShow[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface DiscoverOptions {
  maxMovies?: number;
}

export interface MovieRepository {
  getById(id: number): Promise<MovieDetails | null>;
  getPopular(): Promise<Movie[]>;
  getTrending(): Promise<Movie[]>;
  getTopPicks(): Promise<Movie[]>;
  getUpcoming(): Promise<Movie[]>;
  search(query: string): Promise<Movie[]>;
  discover(
    filters: MoviesDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<MovieDiscoverResult>;
}

export interface TvRepository {
  getById(id: number): Promise<TvDetails | null>;
  getTrending(): Promise<TvShow[]>;
  getPopular(): Promise<TvShow[]>;
  getTopRated(): Promise<TvShow[]>;
  search(query: string): Promise<TvShow[]>;
  discover(filters: TvDiscoverFilters): Promise<TvDiscoverResult>;
}
