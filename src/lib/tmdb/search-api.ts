import { tmdbFetch } from './client';
import type { TmdbMultiSearchResult, TmdbPagedResponse } from './types';

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbMultiSearchResult>>('/search/multi', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}
