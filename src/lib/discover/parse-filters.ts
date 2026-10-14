import type {
  DiscoverFilters,
  DiscoverMediaType,
  MovieDiscoverSort,
  TvDiscoverSort,
} from '@/types';
import { parseDiscoverYear } from '../validations/year-validation';
import { TMDB_DISCOVER_MAX_PAGES } from './pagination';

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

function parseNumber(value: string | null) {
  if (value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePositiveInteger(value: string | null) {
  const parsed = parseNumber(value);

  return parsed !== undefined && Number.isInteger(parsed) && parsed > 0
    ? parsed
    : undefined;
}

function parseBoolean(value: string | null) {
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

  const currentYear = new Date().getFullYear();

  const parsedYearFrom = parseDiscoverYear(params.get('yearFrom'), currentYear);

  const parsedYearTo = parseDiscoverYear(params.get('yearTo'), currentYear);

  const hasInvalidYearRange =
    parsedYearFrom !== undefined &&
    parsedYearTo !== undefined &&
    parsedYearFrom > parsedYearTo;

  const yearFrom = hasInvalidYearRange ? undefined : parsedYearFrom;
  const yearTo = hasInvalidYearRange ? undefined : parsedYearTo;

  const base = {
    genre: parsePositiveInteger(params.get('genre')),
    yearFrom,
    yearTo,
    minRating: parseNumber(params.get('rating')),
    minRuntime: undefined,
    maxRuntime: parsePositiveInteger(params.get('runtime')),
    language: params.get('language')?.trim() || undefined,
    page: Math.min(
      parsePositiveInteger(params.get('page')) ?? 1,
      TMDB_DISCOVER_MAX_PAGES
    ),
    minVoteCount: undefined,
    hideOnShelf: parseBoolean(params.get('hideOnShelf')),
  };

  if (type === 'movie') {
    return {
      ...base,
      type: 'movie',
      sortBy: parseMovieSort(params.get('sort')) ?? 'popularity.desc',
    };
  }

  return {
    ...base,
    type: 'tv',
    sortBy: parseTvSort(params.get('sort')) ?? 'popularity.desc',
  };
}
