import { MovieDiscoverFilters } from '@/types';

const VALID_SORTS = new Set([
  'popularity.desc',
  'vote_average.desc',
  'primary_release_date.desc',
  'primary_release_date.asc',
  'vote_count.desc',
]);

function positiveInteger(value?: string) {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function positiveNumber(value?: string) {
  if (!value) {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : undefined;
}

export function parseDiscoverFilters(params: {
  genre?: string;
  yearFrom?: string;
  yearTo?: string;
  rating?: string;
  runtime?: string;
  language?: string;
  sort?: string;
  page?: string;
  hideOnShelf?: string;
}): MovieDiscoverFilters {
  const sort =
    params.sort && VALID_SORTS.has(params.sort)
      ? (params.sort as MovieDiscoverFilters['sortBy'])
      : 'popularity.desc';

  return {
    genre: positiveInteger(params.genre),
    yearFrom: positiveInteger(params.yearFrom),
    yearTo: positiveInteger(params.yearTo),
    minRating: positiveNumber(params.rating),
    maxRuntime: positiveInteger(params.runtime),
    language: params.language || undefined,
    sortBy: sort,
    page: positiveInteger(params.page) ?? 1,
    hideOnShelf: params.hideOnShelf === 'true',
  };
}
