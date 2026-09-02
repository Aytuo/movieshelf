import type { Media, MovieDetails, TvDetails } from '@/lib/media';
import type {
  DiscoverOptions,
  DiscoverResult,
  MediaSearchResult,
  MovieDiscoverFilters,
  SearchAllResult,
  SearchOptions,
  TvDiscoverFilters,
} from '@/types';

export interface SearchRepository {
  search(query: string, options?: SearchOptions): Promise<SearchAllResult>;
}

export interface MovieRepository {
  getById(id: number): Promise<MovieDetails>;

  getPopular(): Promise<Media[]>;
  getTrending(): Promise<Media[]>;
  getTopPicks(): Promise<Media[]>;
  getNowPlaying(): Promise<Media[]>;
  getUpcoming(): Promise<Media[]>;
  getTopRated(): Promise<Media[]>;

  search(query: string, options?: SearchOptions): Promise<MediaSearchResult>;

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

  search(query: string, options?: SearchOptions): Promise<MediaSearchResult>;

  discover(
    filters: TvDiscoverFilters,
    options?: DiscoverOptions
  ): Promise<DiscoverResult>;
}
