import { tmdbFetch } from './client';
import type { TmdbPagedResponse, TmdbPersonResult } from './types';

export async function searchPeople(query: string, page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbPersonResult>>('/search/person', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}
