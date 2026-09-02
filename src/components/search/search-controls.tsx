'use client';

import type { SearchMediaType } from '@/types';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';

type SearchControlsProps = {
  initialQuery: string;
  initialType: SearchMediaType;
  initialYear?: number;
  currentYear: number;
};

function supportsYear(type: SearchMediaType) {
  return type === 'movie' || type === 'tv';
}

const SearchControls = ({
  initialQuery,
  initialType,
  initialYear,
  currentYear,
}: SearchControlsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchMediaType>(initialType);
  const [year, setYear] = useState(initialYear?.toString() ?? '');

  const inputRef = useRef<HTMLInputElement>(null);

  function buildUrl({
    nextQuery = query,
    nextType = type,
    nextYear = year,
  }: {
    nextQuery?: string;
    nextType?: SearchMediaType;
    nextYear?: string;
  } = {}) {
    const params = new URLSearchParams();

    const trimmedQuery = nextQuery.trim();

    if (trimmedQuery) {
      params.set('q', trimmedQuery);
    }

    if (nextType !== 'all') {
      params.set('type', nextType);

      if (supportsYear(nextType) && nextYear) {
        params.set('year', nextYear);
      }
    }

    const existingPage = searchParams.get('page');

    if (existingPage) {
      params.set('page', existingPage);
    }

    return params.toString() ? `${pathname}?${params.toString()}` : pathname;
  }

  function handleTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextType = event.target.value as SearchMediaType;

    setType(nextType);

    // "All" does not support year, so remove it immediately.
    if (nextType === 'all') {
      setYear('');
    }

    const nextUrl = buildUrl({
      nextType,
      nextYear: supportsYear(nextType) ? year : '',
    });

    router.push(nextUrl, {
      scroll: false,
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUrl = buildUrl({
      nextQuery: query,
      nextType: type,
      nextYear: year,
    });

    const params = new URLSearchParams(
      nextUrl.includes('?') ? nextUrl.split('?')[1] : ''
    );

    // A new search always starts from the first page.
    params.delete('page');

    const finalUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.push(finalUrl, {
      scroll: false,
    });
  }

  function clearQuery() {
    setQuery('');

    inputRef.current?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        'grid gap-3',
        supportsYear(type)
          ? 'sm:grid-cols-[1fr_160px_140px_auto]'
          : 'sm:grid-cols-[1fr_160px_auto]',
      ].join(' ')}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles..."
          className="input h-12 pr-10 pl-10"
        />

        {query && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <select
        name="type"
        value={type}
        onChange={handleTypeChange}
        className="input h-12"
        aria-label="Search media type"
      >
        <option value="all">All</option>

        <option value="movie">Movies</option>

        <option value="tv">TV Series</option>

        <option value="person">People</option>
      </select>

      {supportsYear(type) && (
        <input
          name="year"
          type="number"
          min="1888"
          max={currentYear}
          value={year}
          onChange={(event) => setYear(event.target.value)}
          placeholder="Year"
          className="input h-12"
        />
      )}

      <button
        type="submit"
        className="h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Search
      </button>
    </form>
  );
};

export default SearchControls;
