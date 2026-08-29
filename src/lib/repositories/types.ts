import type { Media, MovieDetails, TvDetails } from '@/lib/media';
import { MovieDiscoverFilters, TvDiscoverFilters } from '@/types';

interface SearchOptions {
  page?: number;
}

interface SearchResult {
  media: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface DiscoverResult {
  media: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface DiscoverOptions {
  maxResults?: number;
}

export interface SearchRepository {
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
}

export interface MovieRepository {
  getById(id: number): Promise<MovieDetails>;
  getPopular(): Promise<Media[]>;
  getTrending(): Promise<Media[]>;
  getTopPicks(): Promise<Media[]>;
  getUpcoming(): Promise<Media[]>;
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
  discover(
    filters: MovieDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<DiscoverResult>;
}

export interface TvRepository {
  getById(id: number): Promise<TvDetails>;
  getTrending(): Promise<Media[]>;
  getPopular(): Promise<Media[]>;
  getTopRated(): Promise<Media[]>;
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
  discover(
    filters: TvDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<DiscoverResult>;
}
