import { tmdbFetch } from './client';
import type { TmdbMultiSearchResponse } from './types';

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch<TmdbMultiSearchResponse>('/search/multi', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}
