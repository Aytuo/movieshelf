'use client';

import { fetchOnboardingMedia } from '@/lib/actions/onboarding-action';
import type { Media, MediaType } from '@/lib/media';
import type { MediaSearchResult } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  LoaderCircle,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import OnboardingMediaCard from './onboarding-media-card';
import OnboardingStepIndicator from './onboarding-step-indicator';

const MIN_SELECTIONS = 5;
const MAX_SELECTIONS = 10;

type SelectionStepProps = {
  initialResult: MediaSearchResult;
  type: MediaType;
  selectedMedia: Media[];
  selectedIds: number[];
  onToggle: (media: Media) => void;
  onContinue: () => void;
  onSkip: () => void;
  error: string | null;
  isPending: boolean;
};

const SelectionStep = ({
  initialResult,
  type,
  selectedMedia,
  selectedIds,
  onToggle,
  onContinue,
  onSkip,
  error,
  isPending,
}: SelectionStepProps) => {
  const isMovie = type === 'movie';
  const mediaLabel = isMovie ? 'movies' : 'TV series';

  const titlesNeededToContinue = Math.max(
    MIN_SELECTIONS - selectedIds.length,
    0
  );

  const titlesRemainingForGoal = Math.max(
    MAX_SELECTIONS - selectedIds.length,
    0
  );

  const progressMessage =
    titlesNeededToContinue > 0
      ? `Choose ${titlesNeededToContinue} more ${
          titlesNeededToContinue === 1 ? 'title' : 'titles'
        } to continue.`
      : titlesRemainingForGoal > 0
        ? `Minimum reached — ${titlesRemainingForGoal} more for better recommendations.`
        : 'Great! Your recommendations can now be better tailored.';

  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState(initialResult.media);
  const [page, setPage] = useState(initialResult.page);
  const [totalPages, setTotalPages] = useState(initialResult.totalPages);
  const [totalResults, setTotalResults] = useState(initialResult.totalResults);
  const [isFetching, setIsFetching] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const requestId = useRef(0);

  async function loadPage(nextPage: number, nextQuery: string) {
    const request = ++requestId.current;

    setIsFetching(true);
    setLoadError(null);
    setResults([]);
    setTotalResults(0);
    setPage(nextPage);

    try {
      const result = await fetchOnboardingMedia({
        type,
        query: nextQuery || undefined,
        page: nextPage,
      });

      if (request !== requestId.current) {
        return;
      }

      setResults(result.media);
      setPage(result.page);
      setTotalPages(Math.max(1, result.totalPages));
      setTotalResults(result.totalResults);
    } catch (requestError) {
      if (request !== requestId.current) {
        return;
      }

      setLoadError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load titles. Please try again.'
      );
    } finally {
      if (request === requestId.current) {
        setIsFetching(false);
      }
    }
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = query.trim();

    if (nextQuery.length === 1) {
      setLoadError('Enter at least 2 characters to search.');
      return;
    }

    setActiveQuery(nextQuery);
    void loadPage(1, nextQuery);
  }

  function clearSearch() {
    setQuery('');
    setActiveQuery('');
    void loadPage(1, '');
  }

  function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages || isFetching) {
      return;
    }

    void loadPage(nextPage, activeQuery);
  }

  return (
    <div className="min-h-screen">
      <div className="container-content pt-8 pb-32 sm:pt-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary-glow)] transition-transform duration-200 group-hover:scale-105">
              <Clapperboard className="size-4" strokeWidth={2.2} />
            </span>

            <span className="text-lg font-bold tracking-tight">
              Movie
              <span className="text-primary">Shelf</span>
            </span>
          </Link>

          <OnboardingStepIndicator type={type} />
        </div>

        <div className="mx-auto max-w-5xl pt-16 pb-12 sm:pt-20">
          <p className="eyebrow">Let&apos;s get to know your taste</p>

          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Pick {isMovie ? 'movies' : 'TV series'}
            <br />
            <span className="text-gradient-primary">you already love.</span>
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Choose at least 5 titles you&apos;ve already seen. Don&apos;t
            overthink it — pick the ones that feel most like you.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-start justify-between gap-3">
              <p
                aria-live="polite"
                className="min-w-0 text-xs leading-5 text-muted-foreground"
              >
                {progressMessage}
              </p>

              <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                {selectedIds.length}/{MAX_SELECTIONS}
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Title selection progress"
              aria-valuemin={0}
              aria-valuemax={MAX_SELECTIONS}
              aria-valuenow={selectedIds.length}
              aria-valuetext={`${selectedIds.length} of ${MAX_SELECTIONS} titles selected`}
              className="h-[6px] overflow-hidden rounded-full bg-surface-hover"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${(selectedIds.length / MAX_SELECTIONS) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <section className="mx-auto mb-8 max-w-5xl">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setLoadError(null);
                }}
                maxLength={100}
                placeholder={`Search ${mediaLabel} by title`}
                aria-label={`Search ${mediaLabel} by title`}
                className="h-11 w-full rounded-lg border border-border bg-surface pr-10 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              {(query || activeQuery) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  disabled={isFetching}
                  aria-label="Clear search"
                  title="Clear search"
                  className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-50"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isFetching}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Search
            </button>
          </form>

          {loadError && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {loadError}
            </p>
          )}

          {selectedMedia.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold">Selected titles</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMedia.map((item) => (
                  <button
                    key={`${item.type}:${item.tmdbId}`}
                    type="button"
                    onClick={() => onToggle(item)}
                    aria-label={`Remove ${item.title} from selection`}
                    title="Remove from selection"
                    className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/5"
                  >
                    <span className="max-w-48 truncate">{item.title}</span>
                    <X className="size-3.5 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedIds.length >= MAX_SELECTIONS && (
            <p className="mt-3 text-xs text-muted-foreground">
              You&apos;ve reached the 10-title limit. Remove a selected title
              before choosing another.
            </p>
          )}
        </section>

        {isFetching && (
          <div
            role="status"
            className="mb-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <LoaderCircle className="size-4 animate-spin" />
            Loading titles...
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-4">
            {activeQuery && (
              <p className="min-w-0 truncate text-right text-xs text-muted-foreground">
                Results for &ldquo;{activeQuery}&rdquo;
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              {totalResults.toLocaleString()} titles
            </p>
          </div>
        )}

        {results.length > 0 ? (
          <div
            aria-busy={isFetching}
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${
              isFetching ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {results.map((item) => (
              <OnboardingMediaCard
                key={`${item.type}:${item.tmdbId}`}
                media={item}
                selected={selectedIds.includes(item.tmdbId)}
                onToggle={() => onToggle(item)}
              />
            ))}
          </div>
        ) : (
          !isFetching &&
          !loadError && (
            <div className="rounded-2xl border border-border/60 p-10 text-center surface">
              <p className="font-medium">
                {activeQuery
                  ? 'No matching titles found'
                  : 'No titles available'}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {activeQuery
                  ? 'Try another title or clear your search to browse popular titles.'
                  : 'Please try again in a moment.'}
              </p>
            </div>
          )
        )}

        {totalResults > 0 && (
          <div className="mt-8 grid grid-cols-3 items-center border-t border-border/60 pt-6">
            {page > 1 ? (
              <button
                type="button"
                onClick={() => changePage(page - 1)}
                disabled={isFetching}
                className="inline-flex h-10 items-center gap-2 justify-self-start rounded-lg border border-border bg-surface px-4 text-sm font-medium transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="size-4" />
                Previous
              </button>
            ) : (
              <span aria-hidden="true" />
            )}

            <p
              aria-live="polite"
              className="text-center text-xs text-muted-foreground"
            >
              Page {page} of {totalPages}
            </p>

            {page < totalPages ? (
              <button
                type="button"
                onClick={() => changePage(page + 1)}
                disabled={isFetching}
                className="inline-flex h-10 items-center gap-2 justify-self-end rounded-lg border border-border bg-surface px-4 text-sm font-medium transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ArrowRight className="size-4" />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
        )}

        {error && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <div className="container-content flex flex-col items-center gap-2 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:flex-row sm:justify-center sm:gap-4 sm:py-4">
            <button
              type="button"
              onClick={onContinue}
              disabled={selectedIds.length < 5 || isPending}
              className="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_var(--primary-glow)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Continue with {selectedIds.length}{' '}
              {selectedIds.length === 1
                ? isMovie
                  ? 'movie'
                  : 'TV series'
                : mediaLabel}
            </button>

            <button
              type="button"
              onClick={onSkip}
              disabled={isPending}
              className="h-9 px-3 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionStep;
