import type { Media } from '@/lib/media';
import type { PersonSearchItem, PersonSearchResult } from './people';

/* ========================================================================== */
/*                                 SEARCH                                     */
/* ========================================================================== */

export type SearchMediaType = 'all' | 'movie' | 'tv' | 'person';

export interface SearchFilters {
  type: SearchMediaType;
  year?: number;
  page?: number;
}

export interface SearchOptions {
  page?: number;
  year?: number;
}

export interface MediaSearchResult {
  media: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export type SearchAllItem =
  | {
      type: 'media';
      media: Media;
    }
  | {
      type: 'person';
      person: PersonSearchItem;
    };

export interface SearchAllResult {
  results: SearchAllItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export type SearchResult =
  SearchAllResult | MediaSearchResult | PersonSearchResult;
