import { Media } from '@/lib/media';

/* ========================================================================== */
/*                                 SEARCH                                     */
/* ========================================================================== */

export type SearchMediaType = 'all' | 'movie' | 'tv';

export interface SearchFilters {
  type: SearchMediaType;
  year?: number;
  page?: number;
}

export interface SearchOptions {
  page?: number;
  year?: number;
}

export interface SearchResult {
  media: Media[];
  page: number;
  totalPages: number;
  totalResults: number;
}
