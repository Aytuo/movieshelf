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

  const pagesNeeded = getSearchPagesNeeded(page);

  const responses = await Promise.all(
    Array.from(
      {
        length: pagesNeeded,
      },
      (_, index) => searchMovies(normalized, index + 1)
    )
  );

  const candidates = responses
    .flatMap((response) => response.results)
    .map(mapTmdbMovie);

  const filtered = filterMovies(candidates, filters);

  const { start, end } = getSearchSlice(page);

  return {
    movies: filtered.slice(start, end),

    page,

    totalResults: filtered.length,

    totalPages: Math.max(1, Math.ceil(filtered.length / SEARCH_PAGE_SIZE)),
  };
}
