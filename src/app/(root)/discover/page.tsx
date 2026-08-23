import DiscoverFilters from '@/components/discover/discover-filters';
import DiscoverPagination from '@/components/discover/discover-pagination';
import MovieSearch from '@/components/discover/movie-search';
import MovieGrid from '@/components/movies/movie-grid';
import { requireSession } from '@/lib/auth/require-session';
import { parseDiscoverFilters } from '@/lib/discover/parse-filters';
import { discoverForUser } from '@/lib/services/discover-service';
import { searchForMovies } from '@/lib/services/movie-search-service';
import Link from 'next/link';

function EmptyDiscoverState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
      <h2 className="font-heading text-xl font-semibold">
        {query ? 'No movies found' : 'Nothing matched those filters'}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {query
          ? 'Try a different title or search term.'
          : 'Try relaxing one or two filters and search again.'}
      </p>
    </div>
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
  }>;
};

const DiscoverPage = async ({ searchParams }: DiscoverPageProps) => {
  const session = await requireSession();

  const params = await searchParams;

  const query = params.q?.trim() ?? '';

  const filters = parseDiscoverFilters(params);

  const hasFilters = Boolean(
    params.genre ||
    params.yearFrom ||
    params.yearTo ||
    params.rating ||
    params.runtime ||
    params.language ||
    params.sort
  );

  let movies = [];
  let page = 1;
  let totalPages = 1;
  let totalResults = 0;

  if (query && !hasFilters) {
    movies = await searchForMovies(query);
    totalResults = movies.length;
  } else {
    const result = await discoverForUser(session.user.id, filters);

    movies = result.movies;
    page = result.page;
    totalPages = result.totalPages;
    totalResults = result.totalResults;
  }

  const title = query ? `Search results for "${query}"` : 'Discover movies';

  return (
    <section className="container-content py-10 lg:py-14">
      <div className="mb-8">
        <p className="eyebrow">Explore</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Find your next movie, explore new genres and discover films that
          deserve a place on your shelf.
        </p>
      </div>

      <MovieSearch />

      <div className="mt-8 grid gap-8 lg:grid-cols-[250px_1fr]">
        <DiscoverFilters />

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {totalResults.toLocaleString()}{' '}
              {totalResults === 1 ? 'movie' : 'movies'}
            </p>

            {page > 1 && (
              <Link
                href={`/discover?page=1`}
                className="text-xs text-primary hover:underline"
              >
                Reset page
              </Link>
            )}
          </div>

          {movies.length > 0 ? (
            <>
              <MovieGrid movies={movies} />

              {totalPages > 1 && (
                <DiscoverPagination page={page} totalPages={totalPages} />
              )}
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
