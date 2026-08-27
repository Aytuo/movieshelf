import DiscoverFilters from '@/components/discover/discover-filters';
import DiscoverPagination from '@/components/discover/discover-pagination';
import MovieSearch from '@/components/discover/movie-search';
import ResetPageButton from '@/components/discover/reset-page-button';
import MovieGrid from '@/components/movies/movie-grid';
import { requireSession } from '@/lib/auth/require-session';
import { parseDiscoverFilters } from '@/lib/discover/parse-filters';
import { discoverForUser } from '@/lib/services/discover-service';
import { searchWithFilters } from '@/lib/services/search-service';
import { MoviesDiscoverFilters } from '@/types';
import Link from 'next/link';

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
      {label}
    </span>
  );
}

function EmptyDiscoverState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
      <h2 className="font-heading text-xl font-semibold">
        {query
          ? 'Nothing matched your search'
          : 'Nothing matched those filters'}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {query
          ? 'Try a different title or relax one of the filters.'
          : 'Try relaxing one or two filters and search again.'}
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

function hasActiveDiscoverFilters(filters: MoviesDiscoverFilters) {
  return Boolean(
    filters.genre ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.minRating !== undefined ||
    filters.maxRating !== undefined ||
    filters.maxRuntime !== undefined ||
    filters.language ||
    filters.sortBy !== 'popularity.desc' ||
    filters.hideOnShelf
  );
}

type DiscoverPageProps = {
  searchParams: Promise<{
    q?: string;
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

const DiscoverPage = async ({ searchParams }: DiscoverPageProps) => {
  const session = await requireSession();

  const params = await searchParams;

  const query = params.q?.trim() ?? '';

  const filters = parseDiscoverFilters(params);

  const page = filters.page ?? 1;

  const result = query
    ? await searchWithFilters({
        query,
        filters,
        page,
      })
    : await discoverForUser(session.user.id, filters);

  return (
    <section className="container-content py-10 lg:py-14">
      <div className="mb-8">
        <p className="eyebrow">{query ? 'Search' : 'Explore'}</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {query ? 'Search results' : 'Discover movies'}
        </h1>

        {query ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">Showing results for</p>

            <p className="mt-1 text-lg font-semibold">&quot;{query}&quot;</p>
          </div>
        ) : (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Find your next movie, explore genres and discover films that deserve
            a place on your shelf.
          </p>
        )}
      </div>

      <MovieSearch />

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
        <DiscoverFilters />

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {query && <FilterChip label={`Search: "${query}"`} />}

                {filters.genre && <FilterChip label="Genre" />}

                {filters.yearFrom && (
                  <FilterChip label={`From ${filters.yearFrom}`} />
                )}

                {filters.yearTo && (
                  <FilterChip label={`Until ${filters.yearTo}`} />
                )}

                {filters.minRating !== undefined && (
                  <FilterChip
                    label={`${filters.minRating.toFixed(1)}+ rating`}
                  />
                )}

                {filters.language && (
                  <FilterChip label={filters.language.toUpperCase()} />
                )}
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                {result.totalResults.toLocaleString()}{' '}
                {result.totalResults === 1 ? 'movie' : 'movies'}
              </p>
            </div>

            {page > 1 && <ResetPageButton />}
          </div>

          {result.movies.length > 0 ? (
            <>
              <MovieGrid movies={result.movies} />

              <DiscoverPagination
                page={result.page}
                totalPages={result.totalPages}
              />
            </>
          ) : (
            <EmptyDiscoverState query={query} />
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscoverPage;
