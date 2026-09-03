import { TmdbPagedResponse } from '../tmdb/types';

const TMDB_PAGE_SIZE = 20;

export async function collectPagedResults<TResult>(
  fetchPage: (page: number) => Promise<TmdbPagedResponse<TResult>>,
  targetCount: number
): Promise<TResult[]> {
  const pagesNeeded = Math.ceil(targetCount / TMDB_PAGE_SIZE);

  const responses = await Promise.all(
    Array.from({ length: pagesNeeded }, (_, index) => fetchPage(index + 1))
  );

  return responses
    .flatMap((response) => response.results)
    .slice(0, targetCount);
}
