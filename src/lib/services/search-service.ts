import { tmdbSearchRepository } from '@/lib/repositories';
import { getSearchPagesNeeded, getSearchSlice } from '@/lib/search/pagination';

export async function searchGlobal(query: string, page: number) {
  const normalized = query.trim();

  if (!normalized) {
    return {
      media: [],
      page: 1,
      totalResults: 0,
      totalPages: 0,
    };
  }

  const firstResponse = await tmdbSearchRepository.search(normalized, {
    page: 1,
  });

  const totalResults = firstResponse.totalResults;

  const totalPages = firstResponse.totalPages;

  if (totalResults === 0 || page > totalPages) {
    return {
      media: [],
      page,
      totalResults,
      totalPages,
    };
  }

  const pagesNeeded = Math.min(getSearchPagesNeeded(page), totalPages);

  const responses = [
    firstResponse,
    ...(pagesNeeded > 1
      ? await Promise.all(
          Array.from({ length: pagesNeeded - 1 }, (_, index) =>
            tmdbSearchRepository.search(normalized, {
              page: index + 2,
            })
          )
        )
      : []),
  ];

  const candidates = responses.flatMap((response) => response.media);

  const { start, end } = getSearchSlice(page);

  return {
    media: candidates.slice(start, end),
    page,
    totalResults,
    totalPages,
  };
}
