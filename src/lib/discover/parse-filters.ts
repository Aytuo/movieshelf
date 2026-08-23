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
}): DiscoverFilters {
  const genre = positiveInteger(params.genre);
  const yearFrom = positiveInteger(params.yearFrom);
  const yearTo = positiveInteger(params.yearTo);
  const minRating = positiveNumber(params.rating);
  const maxRuntime = positiveInteger(params.runtime);
  const page = positiveInteger(params.page) ?? 1;

  const sortBy =
    params.sort && VALID_SORTS.has(params.sort)
      ? (params.sort as DiscoverFilters['sortBy'])
      : 'popularity.desc';

  return {
    genre,
    yearFrom,
    yearTo,
    minRating,
    maxRuntime,
    language: params.language || undefined,
    sortBy,
    page,
  };
}
