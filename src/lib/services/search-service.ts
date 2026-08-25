import { filterMovies } from '@/lib/search/filter-movies';
import {
  getSearchPagesNeeded,
  getSearchSlice,
  SEARCH_PAGE_SIZE,
} from '@/lib/search/pagination';
import { searchMovies } from '@/lib/tmdb/client';
import { mapTmdbMovie } from '@/lib/tmdb/mapper';

export async function searchWithFilters({
  query,
  filters,
  page,
}: {
  query: string;
  filters: DiscoverFilters;
  page: number;
}) {
  const normalized = query.trim();

  if (!normalized) {
    return {
      movies: [],
      page: 1,
      totalResults: 0,
      totalPages: 0,
    };
  }

  /*
   * TMDB gives us the authoritative result count immediately
   * from the first response.
   *
   * We must NOT use the amount of candidates fetched so far
   * as totalResults because that would make pagination grow
   * while the user navigates between pages.
   */
  const firstResponse = await searchMovies(normalized, 1);

  const totalResults = firstResponse.total_results;

  const totalPages = Math.max(1, Math.ceil(totalResults / SEARCH_PAGE_SIZE));

  /*
   * Fetch enough TMDB pages to build the requested
   * MovieShelf application page.
   *
   * We still apply MovieShelf-specific filters locally.
   */
  const pagesNeeded = getSearchPagesNeeded(page);

  const responses = [
    firstResponse,
    ...(pagesNeeded > 1
      ? await Promise.all(
          Array.from(
            {
              length: pagesNeeded - 1,
            },
            (_, index) => searchMovies(normalized, index + 2)
          )
        )
      : []),
  ];

  const candidates = responses
    .flatMap((response) => response.results)
    .map(mapTmdbMovie);

  const filtered = filterMovies(candidates, filters);

  const { start, end } = getSearchSlice(page);

  return {
    movies: filtered.slice(start, end),

    page,

    /*
     * Keep pagination stable.
     *
     * This is intentionally NOT filtered.length.
     */
    totalResults,

    totalPages,
  };
}

/**
 * Dedicated pagination adapter for the /search page.
 *
 * TMDB returns 20 movies per API page while MovieShelf
 * displays 24 movies per application page.
 */
export async function searchMoviesForPage({
  query,
  page,
  year,
}: {
  query: string;
  page: number;
  year?: number;
}) {
  const normalized = query.trim();

  if (!normalized) {
    return {
      movies: [],
      page: 1,
      totalResults: 0,
      totalPages: 0,
    };
  }

  const pagesNeeded = getSearchPagesNeeded(page);

  const responses = await Promise.all(
    Array.from(
      {
        length: pagesNeeded,
      },
      (_, index) =>
        searchMovies(normalized, index + 1, {
          year,
        })
    )
  );

  const firstResponse = responses[0];

  const candidates = responses
    .flatMap((response) => response.results)
    .map(mapTmdbMovie);

  const { start, end } = getSearchSlice(page);

  const totalResults = firstResponse?.total_results ?? 0;

  const totalPages = Math.max(1, Math.ceil(totalResults / SEARCH_PAGE_SIZE));

  return {
    movies: candidates.slice(start, end),
    page,
    totalResults,
    totalPages,
  };
}
