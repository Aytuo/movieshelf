'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import type { SearchMediaType } from '@/types';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type SearchControlsProps = {
  initialQuery: string;
  initialType: SearchMediaType;
  initialYear?: number;
  currentYear: number;
};

function supportsYear(type: SearchMediaType) {
  return type === 'movie' || type === 'tv';
}

const searchTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'TV Series', value: 'tv' },
  { label: 'People', value: 'person' },
];

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

  const debouncedYear = useDebounce(year, 300);
  const previousDebouncedYear = useRef(debouncedYear);

  const buildUrl = useCallback(
    ({
      nextQuery = query,
      nextType = type,
      nextYear = year,
      preservePage = true,
    }: {
      nextQuery?: string;
      nextType?: SearchMediaType;
      nextYear?: string;
      preservePage?: boolean;
    } = {}) => {
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

      if (preservePage) {
        const existingPage = searchParams.get('page');

        if (existingPage) {
          params.set('page', existingPage);
        }
      }

      return params.toString() ? `${pathname}?${params.toString()}` : pathname;
    },
    [pathname, query, type, year, searchParams]
  );

  useEffect(() => {
    if (!supportsYear(type)) {
      previousDebouncedYear.current = debouncedYear;
      return;
    }

    if (previousDebouncedYear.current === debouncedYear) {
      return;
    }

    previousDebouncedYear.current = debouncedYear;

    const nextUrl = buildUrl({
      nextType: type,
      nextYear: debouncedYear,
      preservePage: false,
    });

    router.push(nextUrl, {
      scroll: false,
    });
  }, [debouncedYear, type, buildUrl, router]);

  function navigateWithFilters({
    nextType = type,
    nextYear = year,
  }: {
    nextType?: SearchMediaType;
    nextYear?: string;
  } = {}) {
    const nextUrl = buildUrl({
      nextType,
      nextYear: supportsYear(nextType) ? nextYear : '',
      preservePage: false,
    });

    router.push(nextUrl, {
      scroll: false,
    });
  }

  function handleTypeChange(value: string | null) {
    if (!value) {
      return;
    }

    const nextType = value as SearchMediaType;

    setType(nextType);

    if (!supportsYear(nextType)) {
      setYear('');
    }

    navigateWithFilters({
      nextType,
      nextYear: supportsYear(nextType) ? year : '',
    });
  }

  function handleYearChange(event: ChangeEvent<HTMLInputElement>) {
    setYear(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextUrl = buildUrl({
      nextQuery: query,
      nextType: type,
      nextYear: year,
      preservePage: false,
    });

    router.push(nextUrl, {
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
      className={cn(
        'grid gap-3',
        supportsYear(type)
          ? 'sm:grid-cols-[1fr_160px_140px_auto]'
          : 'sm:grid-cols-[1fr_160px_auto]'
      )}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles..."
          className="h-12 pr-10 pl-10"
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearQuery}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 size-8 -translate-y-1/2 rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      <Select
        items={searchTypeOptions}
        name="type"
        value={type}
        onValueChange={handleTypeChange}
      >
        <SelectTrigger
          id="search-type"
          className="h-12 w-full"
          aria-label="Search media type"
        >
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {searchTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {supportsYear(type) && (
        <Input
          name="year"
          type="number"
          min="1888"
          max={currentYear}
          value={year}
          onChange={handleYearChange}
          placeholder="Year"
          className="h-12"
        />
      )}

      <Button
        type="submit"
        size="lg"
        className="h-12 px-6 hover:bg-primary-hover"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchControls;
