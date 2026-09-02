import MediaSearchResults from '@/components/search/media-search-results';
import PeopleSearchResults from '@/components/search/people-search-results';
import SearchAllResults from '@/components/search/search-all-results';
import SearchControls from '@/components/search/search-controls';
import SearchPagination from '@/components/search/search-pagination';
import { search } from '@/lib/services/search-service';
import type {
  PersonSearchResult,
  SearchAllResult,
  SearchMediaType,
  SearchResult,
} from '@/types';
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
  if (value === 'movie' || value === 'tv' || value === 'person') {
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

function isSearchAllResult(results: SearchResult): results is SearchAllResult {
  return 'results' in results;
}

function isPersonSearchResult(
  results: SearchResult
): results is PersonSearchResult {
  return 'people' in results;
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
          year: type === 'movie' || type === 'tv' ? year : undefined,
          page,
        },
      })
    : null;

  const mediaLabel =
    type === 'movie'
      ? 'movies'
      : type === 'tv'
        ? 'TV series'
        : type === 'person'
          ? 'people'
          : 'titles';

  const currentYear = new Date().getFullYear();

  return (
    <main className="container-content py-12 lg:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Search</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Find {mediaLabel}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search movies, TV series or people by name and, when needed, narrow
            movie and TV results by year.
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

      <section className="py-10 lg:py-14">
        <SearchControls
          initialQuery={query}
          initialType={type}
          initialYear={year}
          currentYear={currentYear}
        />

        {!query ? (
          <div className="mt-10 rounded-2xl p-12 text-center surface">
            <SearchIcon className="mx-auto size-6 text-muted-foreground" />

            <h2 className="mt-4 font-heading text-xl font-semibold">
              Search for something
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Start typing a movie, TV series or person name to find something
              worth watching.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {results?.totalResults.toLocaleString() ?? 0}{' '}
                  {(results?.totalResults ?? 0) === 1 ? 'result' : 'results'}
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

            {results &&
            (isSearchAllResult(results)
              ? results.results.length > 0
              : isPersonSearchResult(results)
                ? results.people.length > 0
                : results.media.length > 0) ? (
              <>
                {isSearchAllResult(results) ? (
                  <div className="mt-10">
                    <SearchAllResults results={results.results} />
                  </div>
                ) : isPersonSearchResult(results) ? (
                  <div className="mt-10">
                    <PeopleSearchResults people={results.people} />
                  </div>
                ) : (
                  <div className="mt-10">
                    <MediaSearchResults media={results.media} />
                  </div>
                )}

                <SearchPagination
                  page={results.page}
                  totalPages={results.totalPages}
                  query={query}
                  type={type}
                  year={type === 'movie' || type === 'tv' ? year : undefined}
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
                  Try a different search.
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
