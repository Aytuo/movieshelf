export const DISCOVER_MIN_YEAR = 1888;

export function parseDiscoverYear(
  value: string | null | undefined,
  currentYear = new Date().getFullYear()
): number | undefined {
  if (value == null || value.trim() === '') {
    return undefined;
  }

  const year = Number(value.trim());

  if (
    !Number.isInteger(year) ||
    year < DISCOVER_MIN_YEAR ||
    year > currentYear
  ) {
    return undefined;
  }

  return year;
}

export function getDiscoverYearRangeError(
  yearFrom: string,
  yearTo: string,
  currentYear = new Date().getFullYear()
): string | null {
  const from = parseDiscoverYear(yearFrom, currentYear);
  const to = parseDiscoverYear(yearTo, currentYear);

  if (
    (yearFrom.trim() !== '' && from === undefined) ||
    (yearTo.trim() !== '' && to === undefined)
  ) {
    return `Enter a year between ${DISCOVER_MIN_YEAR} and ${currentYear}.`;
  }

  if (from !== undefined && to !== undefined && from > to) {
    return 'From year must be less than or equal to To year.';
  }

  return null;
}
