import { tmdbFetch } from './client';
import type {
  TmdbPagedResponse,
  TmdbPersonBundle,
  TmdbPersonResult,
} from './types';

export async function searchPeople(query: string, page = 1) {
  return tmdbFetch<TmdbPagedResponse<TmdbPersonResult>>('/search/person', {
    query,
    page: String(page),
    language: 'en-US',
    include_adult: 'false',
  });
}

export async function getPersonDetails(personId: number) {
  return tmdbFetch<TmdbPersonBundle>(`/person/${personId}`, {
    language: 'en-US',
    append_to_response: 'combined_credits',
  });
}
