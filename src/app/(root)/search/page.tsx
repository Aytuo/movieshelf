import SearchPagination from '@/components/search/search-pagination';
import { search } from '@/lib/services/search-service';
import { tmdbImage } from '@/lib/tmdb/images';
import type { SearchMediaType } from '@/types/search';
import { Search } from 'lucide-react';
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
    type === 'movie' ? 'movie' : type === 'tv' ? 'TV series' : 'title';

  const currentYear = new Date().getFullYear();

  return (
    <section className="container-content py-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="eyebrow">Search</p>

          <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Find {mediaLabel}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search by title and narrow down the result by media type or release
            year.
          </p>
        </div>

        <form className="grid gap-3 sm:grid-cols-[1fr_160px_140px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

            <input
              name="q"
              defaultValue={query}
              placeholder="Search titles..."
              className="input h-12 pl-10"
            />
          </div>

          <select name="type" defaultValue={type} className="input h-12">
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Series</option>
          </select>

          <input
            name="year"
            type="number"
            min="1888"
            max={currentYear}
            defaultValue={year ?? ''}
            placeholder="Year"
            disabled={type === 'all'}
            className="input h-12 disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="submit"
            className="h-12 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Search
          </button>
        </form>

        {type === 'all' && year !== undefined && (
          <p className="mt-3 text-xs text-muted-foreground">
            The year filter is available when searching Movies or TV Series.
          </p>
        )}

        {!query ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border px-6 py-24 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-surface">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-5 font-heading text-xl font-semibold">
              What are you looking for?
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Search for a movie or TV series by title, with an optional year
              filter.
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

            {results.media.length > 0 ? (
              <>
                <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {results.media.map((item) => {
                    const poster = tmdbImage(item.posterPath, 'w500');

                    const year = item.releaseDate
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
                          <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                            {poster && (
                              <img
                                src={poster}
                                alt={`${item.title} poster`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                            )}
                          </div>

                          <div className="mt-3 flex items-start gap-2">
                            <h3 className="line-clamp-1 flex-1 text-sm font-semibold group-hover:text-primary">
                              {item.title}
                            </h3>

                            <span className="shrink-0 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                              {item.type === 'movie' ? 'Movie' : 'TV'}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {year ?? '—'}
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
                  type={type}
                  year={type === 'all' ? undefined : year}
                />
              </>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-border px-6 py-20 text-center">
                <h2 className="font-heading text-xl font-semibold">
                  Nothing found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Try a different title or adjust your search filters.
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
