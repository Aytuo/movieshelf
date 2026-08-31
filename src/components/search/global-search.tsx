'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { Media } from '@/lib/media';
import { ArrowRight, Command, Loader2, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import SearchEmptyState from './search-empty-state';
import SearchResults from './search-result';

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const normalized = debouncedQuery.trim();

    if (normalized.length < 2) {
      queueMicrotask(() => {
        setResults([]);
        setTotalResults(0);
        setIsLoading(false);
        setError(null);
      });

      return;
    }

    const controller = new AbortController();

    async function search() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(normalized)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Search request failed.');
        }

        const data = (await response.json()) as {
          media: Media[];
          totalResults: number;
        };
        setResults(data.media);
        setTotalResults(data.totalResults);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setResults([]);
        setTotalResults(0);
        setError("We couldn't search right now.");
      } finally {
        setIsLoading(false);
      }
    }

    void search();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });

    return () => {
      setMounted(false);
    };
  }, []);

  function close() {
    setOpen(false);
    setQuery('');
    setResults([]);
    setTotalResults(0);
    setError(null);
  }

  function clearSearch() {
    setQuery('');
    setResults([]);
    setTotalResults(0);
    setError(null);

    inputRef.current?.focus();
  }

  function openSearch() {
    setOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="hover:border-border-strong hidden h-10 w-64 items-center gap-3 rounded-lg border border-border bg-surface/80 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-surface-hover lg:flex xl:w-72"
      >
        <Search className="size-4 shrink-0" />

        <span className="flex-1">Search...</span>

        <kbd className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <Command className="size-2.5" />K
        </kbd>
      </button>

      <button
        type="button"
        onClick={openSearch}
        aria-label="Search"
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
      >
        <Search className="size-4" />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/70 p-4 backdrop-blur-md sm:p-6"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                close();
              }
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Search movies"
              onPointerDown={(event) => event.stopPropagation()}
              className="mx-auto mt-[8vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[0_30px_120px_rgb(0_0_0_/_60%)]"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <Search className="size-5 shrink-0 text-muted-foreground" />

                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search movies & TV series..."
                  className="h-16 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/60 sm:text-lg"
                  autoComplete="off"
                  spellCheck={false}
                />

                {isLoading && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="max-h-[65vh] overflow-y-auto">
                {query.trim().length < 2 ? (
                  <SearchEmptyState />
                ) : error ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                ) : results.length > 0 ? (
                  <SearchResults results={results} onResultClick={close} />
                ) : !isLoading ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm font-medium">No results found.</p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Try a different movie or TV series title.
                    </p>
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
                <p className="text-[11px] text-muted-foreground">
                  Find a movie or TV series
                </p>

                {query.trim().length >= 2 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query.trim())}`}
                    onClick={close}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary-hover"
                  >
                    View all{' '}
                    {totalResults > 0
                      ? `${totalResults.toLocaleString()} results`
                      : 'results'}
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>,

          document.body
        )}
    </>
  );
};

export default GlobalSearch;
