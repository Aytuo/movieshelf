'use client';

import {
  DISCOVER_SORT_OPTIONS,
  LANGUAGE_OPTIONS,
  MOVIE_GENRES,
  TV_GENRES,
} from '@/constants';
import { useDebounce } from '@/hooks/use-debounce';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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

type FilterState = {
  genre: string;
  yearFrom: string;
  yearTo: string;
  rating: string;
  runtime: string;
  language: string;
  sort: string;
  hideOnShelf: string;
};

const FILTER_KEYS = [
  'genre',
  'yearFrom',
  'yearTo',
  'rating',
  'runtime',
  'language',
  'sort',
  'hideOnShelf',
] as const;

function readFilters(params: URLSearchParams): FilterState {
  return {
    genre: params.get('genre') ?? '',
    yearFrom: params.get('yearFrom') ?? '',
    yearTo: params.get('yearTo') ?? '',
    rating: params.get('rating') ?? '',
    runtime: params.get('runtime') ?? '',
    language: params.get('language') ?? '',
    sort: params.get('sort') ?? 'popularity.desc',
    hideOnShelf: params.get('hideOnShelf') ?? '',
  };
}

const DiscoverFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlString = searchParams.toString();
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';

  const genres = type === 'movie' ? MOVIE_GENRES : TV_GENRES;

  const sortOptions = DISCOVER_SORT_OPTIONS.filter((option) =>
    type === 'movie'
      ? !option.value.startsWith('first_air_date')
      : !option.value.startsWith('primary_release_date')
  );

  const genreOptions = [
    { label: 'All genres', value: null },
    ...genres.map((genre) => ({
      label: genre.name,
      value: String(genre.id),
    })),
  ];

  const ratingOptions = [
    { label: 'Any rating', value: null },
    ...[6, 7, 7.5, 8, 8.5, 9].map((rating) => ({
      label: `${rating.toFixed(1)}+`,
      value: String(rating),
    })),
  ];

  const runtimeOptions = [
    { label: 'Any runtime', value: null },
    { label: 'Under 90 min', value: '90' },
    { label: 'Under 2 hours', value: '120' },
    { label: 'Under 2h 30m', value: '150' },
    { label: 'Under 3 hours', value: '180' },
  ];

  const languageOptions = [
    { label: 'Any language', value: null },
    ...LANGUAGE_OPTIONS.map((language) => ({
      label: language.label,
      value: language.value,
    })),
  ];

  const sortSelectOptions = sortOptions.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const [draft, setDraft] = useState<FilterState>(() =>
    readFilters(new URLSearchParams(urlString))
  );

  const debouncedDraft = useDebounce(draft, 500);

  const dirtyRef = useRef(false);

  const lastAppliedUrl = useRef(urlString);

  useEffect(() => {
    if (urlString === lastAppliedUrl.current) {
      return;
    }

    setDraft(readFilters(new URLSearchParams(urlString)));

    dirtyRef.current = false;
    lastAppliedUrl.current = urlString;
  }, [urlString]);

  useEffect(() => {
    if (!dirtyRef.current) {
      return;
    }

    const params = new URLSearchParams(urlString);

    for (const key of FILTER_KEYS) {
      params.delete(key);
    }

    if (debouncedDraft.genre) {
      params.set('genre', debouncedDraft.genre);
    }

    if (debouncedDraft.yearFrom) {
      params.set('yearFrom', debouncedDraft.yearFrom);
    }

    if (debouncedDraft.yearTo) {
      params.set('yearTo', debouncedDraft.yearTo);
    }

    if (debouncedDraft.rating) {
      params.set('rating', debouncedDraft.rating);
    }

    if (debouncedDraft.runtime) {
      params.set('runtime', debouncedDraft.runtime);
    }

    if (debouncedDraft.language) {
      params.set('language', debouncedDraft.language);
    }

    if (debouncedDraft.sort && debouncedDraft.sort !== 'popularity.desc') {
      params.set('sort', debouncedDraft.sort);
    }

    if (debouncedDraft.hideOnShelf) {
      params.set('hideOnShelf', debouncedDraft.hideOnShelf);
    }

    params.delete('page');

    // Preserve the currently selected Movie / TV type.

    if (type === 'tv') {
      params.set('type', 'tv');
    } else {
      params.delete('type');
    }

    const query = params.toString();

    lastAppliedUrl.current = query;

    dirtyRef.current = false;

    router.replace(query ? `/discover?${query}` : '/discover', {
      scroll: false,
    });
  }, [debouncedDraft, router, type, urlString]);

  function update(key: keyof FilterState, value: string) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));

    dirtyRef.current = true;
  }

  function reset() {
    setDraft({
      genre: '',
      yearFrom: '',
      yearTo: '',
      rating: '',
      runtime: '',
      language: '',
      sort: 'popularity.desc',
      hideOnShelf: '',
    });

    dirtyRef.current = true;
  }

  const hasFilters = Boolean(
    draft.genre ||
    draft.yearFrom ||
    draft.yearTo ||
    draft.rating ||
    draft.runtime ||
    draft.language ||
    draft.hideOnShelf ||
    draft.sort !== 'popularity.desc'
  );

  return (
    <aside className="rounded-2xl border border-border p-5 surface">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />

          <span className="text-sm font-semibold">Filters</span>
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={reset}
            className="h-auto rounded-none px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Reset
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="label">Genre</label>

          <Select
            items={genreOptions}
            value={draft.genre || null}
            onValueChange={(value) => update('genre', value ?? '')}
          >
            <SelectTrigger id="discover-genre" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {genreOptions.map((option) => (
                  <SelectItem key={option.value ?? 'all'} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">From year</label>

            <Input
              type="number"
              min="1888"
              max={new Date().getFullYear()}
              value={draft.yearFrom}
              onChange={(event) => update('yearFrom', event.target.value)}
              placeholder="2010"
            />
          </div>

          <div>
            <label className="label">To year</label>

            <Input
              type="number"
              min="1888"
              max={new Date().getFullYear()}
              value={draft.yearTo}
              onChange={(event) => update('yearTo', event.target.value)}
              placeholder="2025"
            />
          </div>
        </div>

        <div>
          <label className="label">Minimum rating</label>

          <Select
            items={ratingOptions}
            value={draft.rating || null}
            onValueChange={(value) => update('rating', value ?? '')}
          >
            <SelectTrigger id="discover-rating" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {ratingOptions.map((option) => (
                  <SelectItem key={option.value ?? 'any'} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="label">Maximum runtime</label>

          <Select
            items={runtimeOptions}
            value={draft.runtime || null}
            onValueChange={(value) => update('runtime', value ?? '')}
          >
            <SelectTrigger id="discover-runtime" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {runtimeOptions.map((option) => (
                  <SelectItem key={option.value ?? 'any'} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="label">Original language</label>

          <Select
            items={languageOptions}
            value={draft.language || null}
            onValueChange={(value) => update('language', value ?? '')}
          >
            <SelectTrigger id="discover-language" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value ?? 'any'} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="label">Sort by</label>

          <Select
            items={sortSelectOptions}
            value={draft.sort}
            onValueChange={(value) => {
              if (value) {
                update('sort', value);
              }
            }}
          >
            <SelectTrigger id="discover-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {sortSelectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t border-border/60 pt-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={draft.hideOnShelf === 'true'}
              onChange={(event) =>
                update('hideOnShelf', event.target.checked ? 'true' : '')
              }
              className="mt-0.5 size-4 rounded border-border accent-primary"
            />

            <span>
              <span className="block text-sm font-medium">
                Hide media on my shelf
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Only show {type === 'movie' ? 'movies' : 'TV series'} you
                haven&apos;t already added to your collection.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* <p className="mt-5 text-[11px] leading-5 text-muted-foreground">
        Changes are applied automatically when you stop editing.
      </p> */}
    </aside>
  );
};

export default DiscoverFilters;
