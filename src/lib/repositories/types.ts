import type { Media, MovieDetails, TvDetails } from '@/lib/media';
import {
  DiscoverOptions,
  DiscoverResult,
  MovieDiscoverFilters,
  TvDiscoverFilters,
} from '@/types';
import { SearchOptions, SearchResult } from '@/types/search';

export interface SearchRepository {
  search(query: string, options?: SearchOptions): Promise<SearchResult>;
}

export interface MovieRepository {
  getById(id: number): Promise<MovieDetails>;

  getPopular(): Promise<Media[]>;
  getTrending(): Promise<Media[]>;
  getTopPicks(): Promise<Media[]>;
  getNowPlaying(): Promise<Media[]>;
  getUpcoming(): Promise<Media[]>;
  getTopRated(): Promise<Media[]>;

  search(query: string, options?: SearchOptions): Promise<SearchResult>;

  discover(
    filters: MovieDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<DiscoverResult>;
}

export interface TvRepository {
  getById(id: number): Promise<TvDetails>;

  getPopular(): Promise<Media[]>;
  getTrending(): Promise<Media[]>;
  getTopPicks(): Promise<Media[]>;
  getAiringToday(): Promise<Media[]>;
  getOnTheAir(): Promise<Media[]>;
  getTopRated(): Promise<Media[]>;

  search(query: string, options?: SearchOptions): Promise<SearchResult>;

  discover(
    filters: TvDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<DiscoverResult>;
}
