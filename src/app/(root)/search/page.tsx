import SearchPagination from '@/components/search/search-pagination';
import { searchMoviesForPage } from '@/lib/services/search-service';
import { tmdbImage } from '@/lib/tmdb/images';
import { Search } from 'lucide-react';
import Link from 'next/link';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    year?: string;
    page?: string;
  }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const parsedYear = Number(params.year);
  const year =
    Number.isInteger(parsedYear) && parsedYear > 0 ? parsedYear : undefined;
  const parsedPage = Number(params.page);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  let results = {
    movies: [] as Awaited<ReturnType<typeof searchMoviesForPage>>['movies'],
    page: 1,
    totalResults: 0,
    totalPages: 0,
  };

  if (query) {
    results = await searchMoviesForPage({
      query,
      page: currentPage,
      year,
    });
  }

  return (
    <section className="container-content py-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="eyebrow">Search</p>

          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Find a movie
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search by title, then narrow down the exact result you&apos;re
            looking for.
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              name="q"
              defaultValue={query}
              placeholder="Search movie title..."
              className="input h-12 pl-10"
            />
          </div>

          <input
            name="year"
            type="number"
            min="1888"
            max={new Date().getFullYear()}
            defaultValue={year ?? ''}
            placeholder="Year"
            className="input h-12"
          />

          <button
            type="submit"
            className="h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Search
          </button>
        </form>

        {!query ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border px-6 py-24 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-surface">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-5 font-heading text-xl font-semibold">
              What movie are you looking for?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Search for a title or add a release year to narrow down the
              results.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {results.totalResults.toLocaleString()}{' '}
                  {results.totalResults === 1 ? 'result' : 'results'}
                </p>

                <h2 className="mt-1 font-heading text-2xl font-bold">
                  {query}
                </h2>
              </div>

              <Link
                href="/discover"
                className="hidden text-xs font-medium text-primary hover:underline sm:block"
              >
                Looking to explore? →
              </Link>
            </div>

            {results.movies.length > 0 ? (
              <>
                <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.movies.map((movie) => {
                    const poster = tmdbImage(movie.posterPath, 'w500');

                    return (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        className="group"
                      >
                        <article>
                          <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                            {poster && (
                              <img
                                src={poster}
                                alt={`${movie.title} poster`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            )}
                          </div>

                          <h3 className="mt-3 line-clamp-1 text-sm font-semibold group-hover:text-primary">
                            {movie.title}
                          </h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).getFullYear()
                              : '—'}
                          </p>
                        </article>
                      </Link>
                    );
                  })}
                </div>

                <SearchPagination
                  page={results.page}
                  totalPages={results.totalPages}
                  query={query}
                  year={year}
                />
              </>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
                <h2 className="font-heading text-xl font-semibold">
                  Nothing found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Try a different title or remove the year filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
