import DiscoverFilters from '@/components/discover/discover-filters';
import DiscoverPagination from '@/components/discover/discover-pagination';
import ResetPageButton from '@/components/discover/reset-page-button';
import MediaGrid from '@/components/media/media-grid';
import { requireSession } from '@/lib/auth/require-session';
import { parseDiscoverFilters } from '@/lib/discover/parse-filters';
import { discoverForUser } from '@/lib/services/discover-service';
import type { DiscoverFilters as DiscoverFiltersType } from '@/types';
import Link from 'next/link';

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function EmptyDiscoverState() {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
      <h2 className="font-heading text-xl font-semibold">
        Nothing matched those filters
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try relaxing one or two filters and explore again.
      </p>

      <Link
        href="/discover"
        className="mt-6 inline-flex rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-hover"
      >
        Clear everything
      </Link>
    </div>
  );
}

function hasActiveDiscoverFilters(filters: DiscoverFiltersType) {
  return Boolean(
    filters.genre ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.minRating !== undefined ||
    filters.maxRating !== undefined ||
    filters.minRuntime !== undefined ||
    filters.maxRuntime !== undefined ||
    filters.minVoteCount !== undefined ||
    filters.language ||
    filters.sortBy !== 'popularity.desc' ||
    filters.hideOnShelf
  );
}

type DiscoverPageProps = {
  searchParams: Promise<{
    type?: string;
    genre?: string;
    yearFrom?: string;
    yearTo?: string;
    rating?: string;
    runtime?: string;
    language?: string;
    sort?: string;
    page?: string;
    hideOnShelf?: string;
  }>;
};

function toURLSearchParams(params: Awaited<DiscoverPageProps['searchParams']>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, value);
    }
  }

  return searchParams;
}

const DiscoverPage = async ({ searchParams }: DiscoverPageProps) => {
  const session = await requireSession();

  const params = await searchParams;

  const filters = parseDiscoverFilters(toURLSearchParams(params));

  const result = await discoverForUser(session.user.id, filters);

  const isMovie = filters.type === 'movie';

  const mediaLabel = isMovie ? 'movies' : 'TV series';

  const hasFilters = hasActiveDiscoverFilters(filters);

  return (
    <section className="container-content py-10 lg:py-14">
      <div className="mb-8">
        <p className="eyebrow">Discover</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Discover {mediaLabel}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Explore {mediaLabel}, browse genres, and find something that deserves
          a place on your shelf.
        </p>
      </div>

      {/* Media type */}
      <div className="mb-6 flex gap-2">
        <Link
          href="/discover"
          className={[
            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
            isMovie
              ? 'border-primary/30 bg-primary-muted text-primary'
              : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground',
          ].join(' ')}
        >
          Movies
        </Link>

        <Link
          href="/discover?type=tv"
          className={[
            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
            !isMovie
              ? 'border-primary/30 bg-primary-muted text-primary'
              : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground',
          ].join(' ')}
        >
          TV Series
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
        <DiscoverFilters />

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {hasFilters && <FilterChip label="Filters active" />}

                {filters.genre !== undefined && <FilterChip label="Genre" />}

                {filters.yearFrom !== undefined && (
                  <FilterChip label={`From ${filters.yearFrom}`} />
                )}

                {filters.yearTo !== undefined && (
                  <FilterChip label={`Until ${filters.yearTo}`} />
                )}

                {filters.minRating !== undefined && (
                  <FilterChip
                    label={`${filters.minRating.toFixed(1)}+ rating`}
                  />
                )}

                {filters.maxRating !== undefined && (
                  <FilterChip
                    label={`Up to ${filters.maxRating.toFixed(1)} rating`}
                  />
                )}

                {filters.maxRuntime !== undefined && (
                  <FilterChip label={`Up to ${filters.maxRuntime} min`} />
                )}

                {filters.language && (
                  <FilterChip label={filters.language.toUpperCase()} />
                )}

                {filters.hideOnShelf && <FilterChip label="Hide on shelf" />}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {result.totalResults.toLocaleString()}{' '}
                {result.totalResults === 1
                  ? mediaLabel.slice(0, -1)
                  : mediaLabel}
              </p>
            </div>

            {result.page > 1 && <ResetPageButton />}
          </div>

          {result.media.length > 0 ? (
            <>
              <MediaGrid media={result.media} />

              <DiscoverPagination
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          ) : (
            <EmptyDiscoverState />
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscoverPage;
