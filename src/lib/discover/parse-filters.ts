import type {
  DiscoverFilters,
  DiscoverMediaType,
  MovieDiscoverSort,
  TvDiscoverSort,
} from '@/types';

const MOVIE_DISCOVER_SORTS = [
  'popularity.desc',
  'vote_average.desc',
  'primary_release_date.desc',
  'primary_release_date.asc',
  'vote_count.desc',
] satisfies readonly MovieDiscoverSort[];

const TV_DISCOVER_SORTS = [
  'popularity.desc',
  'vote_average.desc',
  'first_air_date.desc',
  'first_air_date.asc',
  'vote_count.desc',
] satisfies readonly TvDiscoverSort[];

function parseNumber(value: string | null): number | undefined {
  if (value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

function parseMediaType(value: string | null): DiscoverMediaType {
  return value === 'tv' ? 'tv' : 'movie';
}

function parseMovieSort(value: string | null): MovieDiscoverSort | undefined {
  if (!value) {
    return undefined;
  }

  return MOVIE_DISCOVER_SORTS.includes(value as MovieDiscoverSort)
    ? (value as MovieDiscoverSort)
    : undefined;
}

function parseTvSort(value: string | null): TvDiscoverSort | undefined {
  if (!value) {
    return undefined;
  }

  return TV_DISCOVER_SORTS.includes(value as TvDiscoverSort)
    ? (value as TvDiscoverSort)
    : undefined;
}

export function parseDiscoverFilters(params: URLSearchParams): DiscoverFilters {
  const type = parseMediaType(params.get('type'));

  const base = {
    genre: parseNumber(params.get('genre')),
    yearFrom: parseNumber(params.get('yearFrom')),
    yearTo: parseNumber(params.get('yearTo')),
    minRating: parseNumber(params.get('minRating')),
    maxRating: parseNumber(params.get('maxRating')),
    minRuntime: parseNumber(params.get('minRuntime')),
    maxRuntime: parseNumber(params.get('maxRuntime')),
    minVoteCount: parseNumber(params.get('minVoteCount')),
    language: params.get('language') || undefined,
    page: parseNumber(params.get('page')) ?? 1,
    hideOnShelf: parseBoolean(params.get('hideOnShelf')),
  };

  if (type === 'movie') {
    return {
      ...base,
      type: 'movie',
      sortBy: parseMovieSort(params.get('sort')),
    };
  }

  return {
    ...base,
    type: 'tv',
    sortBy: parseTvSort(params.get('sort')),
  };
}
