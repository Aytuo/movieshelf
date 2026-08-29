/* ========================================================================== */
/*                                 SEARCH                                     */
/* ========================================================================== */

export type SearchMediaType = 'all' | 'movie' | 'tv';

export interface SearchFilters {
  type: SearchMediaType;
  year?: number;
  page?: number;
}
