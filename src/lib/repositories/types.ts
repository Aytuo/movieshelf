import type {
  Media,
  Movie,
  MovieDetails,
  TvDetails,
  TvShow,
} from '@/lib/media';
import { MovieDiscoverFilters, TvDiscoverFilters } from '@/types';

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
  getPopular(): Promise<Media[]>;
  getTrending(): Promise<Media[]>;
  getTopPicks(): Promise<Media[]>;
  getUpcoming(): Promise<Media[]>;
  search(query: string): Promise<Media[]>;
  discover(
    filters: MovieDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<MovieDiscoverResult>;
}

export interface TvRepository {
  getById(id: number): Promise<TvDetails | null>;
  getTrending(): Promise<Media[]>;
  getPopular(): Promise<Media[]>;
  getTopRated(): Promise<Media[]>;
  search(query: string): Promise<Media[]>;
  discover(
    filters: TvDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<TvDiscoverResult>;
}
