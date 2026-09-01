import SearchControls from '@/components/search/search-controls';
import SearchPagination from '@/components/search/search-pagination';
import { search } from '@/lib/services/search-service';
import { tmdbImage } from '@/lib/tmdb/images';
import type { SearchMediaType } from '@/types';
import { ArrowRight, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    year?: string;
    page?: string;
  }>;
};

function parseSearchType(value: string | undefined): SearchMediaType {
  if (value === 'movie' || value === 'tv') {
    return value;
  }

  return 'all';
}

function parseYear(value: string | undefined) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function parsePage(value: string | undefined) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;

  const query = params.q?.trim() ?? '';

  const type = parseSearchType(params.type);

  const year = parseYear(params.year);

  const page = parsePage(params.page);

  const results = query
    ? await search({
        query,
        filters: {
          type,
          year: type === 'all' ? undefined : year,
          page,
        },
      })
    : {
        media: [],
        page: 1,
        totalResults: 0,
        totalPages: 0,
      };

  const mediaLabel =
    type === 'movie' ? 'movies' : type === 'tv' ? 'TV series' : 'titles';

  const currentYear = new Date().getFullYear();

  return (
    <main className="container-content py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Search</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Find {mediaLabel}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search movies and TV series by title and, when needed, narrow the
            results by year.
          </p>
        </div>

        <Link
          href="/discover"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Discover
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Search controls */}
      <section className="py-10 lg:py-14">
        <SearchControls
          initialQuery={query}
          initialType={type}
          initialYear={year}
          currentYear={currentYear}
        />

        {/* Initial empty state */}
        {!query ? (
          <div className="mt-10 rounded-2xl p-12 text-center surface">
            <SearchIcon className="mx-auto size-6 text-muted-foreground" />

            <h2 className="mt-4 font-heading text-xl font-semibold">
              Search for something
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Start typing a movie or TV series title to find something worth
              watching.
            </p>
          </div>
        ) : (
          <>
            {/* Results header */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {results.totalResults.toLocaleString()}{' '}
                  {results.totalResults === 1 ? 'result' : 'results'}
                </p>

                <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight">
                  {query}
                </h2>
              </div>

              <Link
                href="/discover"
                className="hidden items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary-hover sm:inline-flex"
              >
                Looking to explore?
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {results.media.length > 0 ? (
              <>
                <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {results.media.map((item) => {
                    const poster = tmdbImage(item.posterPath, 'w500');

                    const releaseYear = item.releaseDate
                      ? new Date(item.releaseDate).getFullYear()
                      : null;

                    const href =
                      item.type === 'movie'
                        ? `/movie/${item.tmdbId}`
                        : `/tv/${item.tmdbId}`;

                    return (
                      <Link
                        key={`${item.type}:${item.tmdbId}`}
                        href={href}
                        className="group"
                      >
                        <article>
                          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                            {poster ? (
                              <img
                                src={poster}
                                alt={`${item.title} poster`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
                                No poster
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                            <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
                              {item.type === 'movie' ? 'Movie' : 'TV'}
                            </span>
                          </div>

                          <div className="mt-3">
                            <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                              {item.title}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {releaseYear ?? '—'}
                            </p>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>

                <SearchPagination
                  page={results.page}
                  totalPages={results.totalPages}
                  query={query}
                  type={type}
                  year={type === 'all' ? undefined : year}
                />
              </>
            ) : (
              <div className="mt-10 rounded-2xl p-12 text-center surface">
                <SearchIcon className="mx-auto size-6 text-muted-foreground" />

                <h2 className="mt-4 font-heading text-xl font-semibold">
                  Nothing found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  We couldn&apos;t find any {mediaLabel} matching your search.
                  Try a different title.
                </p>

                <Link
                  href="/discover"
                  className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Discover
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default SearchPage;
