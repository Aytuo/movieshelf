import type { TmdbPagedResponse } from '../tmdb/types';

const TMDB_PAGE_SIZE = 20;

export async function collectPagedResults<TResult>(
  fetchPage: (page: number) => Promise<TmdbPagedResponse<TResult>>,
  targetCount: number
): Promise<TResult[]> {
  const pagesNeeded = Math.ceil(targetCount / TMDB_PAGE_SIZE);

  const results: TResult[] = [];

  for (let page = 1; page <= pagesNeeded; page += 1) {
    const response = await fetchPage(page);

    results.push(...response.results);

    if (results.length >= targetCount) {
      break;
    }

    if (page >= response.total_pages) {
      break;
    }
  }

  return results.slice(0, targetCount);
}
