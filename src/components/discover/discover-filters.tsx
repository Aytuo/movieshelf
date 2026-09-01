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
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="label">Genre</label>

          <select
            value={draft.genre}
            onChange={(event) => update('genre', event.target.value)}
            className="input"
          >
            <option value="">All genres</option>

            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">From year</label>

            <input
              type="number"
              min="1888"
              max={new Date().getFullYear()}
              value={draft.yearFrom}
              onChange={(event) => update('yearFrom', event.target.value)}
              className="input"
              placeholder="2010"
            />
          </div>

          <div>
            <label className="label">To year</label>

            <input
              type="number"
              min="1888"
              max={new Date().getFullYear()}
              value={draft.yearTo}
              onChange={(event) => update('yearTo', event.target.value)}
              className="input"
              placeholder="2025"
            />
          </div>
        </div>

        <div>
          <label className="label">Minimum rating</label>

          <select
            value={draft.rating}
            onChange={(event) => update('rating', event.target.value)}
            className="input"
          >
            <option value="">Any rating</option>

            {[6, 7, 7.5, 8, 8.5, 9].map((rating) => (
              <option key={rating} value={rating}>
                {rating.toFixed(1)}+
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Maximum runtime</label>

          <select
            value={draft.runtime}
            onChange={(event) => update('runtime', event.target.value)}
            className="input"
          >
            <option value="">Any runtime</option>

            <option value="90">Under 90 min</option>

            <option value="120">Under 2 hours</option>

            <option value="150">Under 2h 30m</option>

            <option value="180">Under 3 hours</option>
          </select>
        </div>

        <div>
          <label className="label">Original language</label>

          <select
            value={draft.language}
            onChange={(event) => update('language', event.target.value)}
            className="input"
          >
            <option value="">Any language</option>

            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Sort by</label>

          <select
            value={draft.sort}
            onChange={(event) => update('sort', event.target.value)}
            className="input"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

      <p className="mt-5 text-[11px] leading-5 text-muted-foreground">
        Changes are applied automatically when you stop editing.
      </p>
    </aside>
  );
};

export default DiscoverFilters;
