/* ========================================================================== */
/*                                 SEARCH                                     */
/* ========================================================================== */

export type SearchMediaType = 'all' | 'movie' | 'tv';

export interface SearchFilters {
  type: SearchMediaType;
  yearFrom?: number;
  yearTo?: number;
  genre?: number;
  page?: number;
}
