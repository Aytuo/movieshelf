import RankingList from '@/components/rankings/ranking-list';
import { getMovieRanking, getTvRanking } from '@/lib/services/ranking-service';
import type { RankingType } from '@/types';
import Link from 'next/link';

type RankingsPageProps = {
  searchParams: Promise<{
    type?: string;
  }>;
};

function parseRankingType(value: string | undefined): RankingType {
  return value === 'tv' ? 'tv' : 'movie';
}

const RankingsPage = async ({ searchParams }: RankingsPageProps) => {
  const params = await searchParams;

  const type = parseRankingType(params.type);

  const ranking =
    type === 'tv' ? await getTvRanking() : await getMovieRanking();

  const title = type === 'tv' ? 'Top 100 TV Series' : 'Top 100 Movies';

  const description =
    type === 'tv'
      ? 'The 100 highest-ranked TV series on MovieShelf.'
      : 'The 100 highest-ranked movies on MovieShelf.';

  return (
    <main className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 lg:mb-14">
          <p className="eyebrow">Rankings</p>

          <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="inline-flex w-fit rounded-lg border border-border bg-surface p-1">
              <Link
                href="/rankings"
                className={[
                  'rounded-md px-3 py-2 text-xs font-semibold transition-colors',
                  type === 'movie'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                Movies
              </Link>

              <Link
                href="/rankings?type=tv"
                className={[
                  'rounded-md px-3 py-2 text-xs font-semibold transition-colors',
                  type === 'tv'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                TV Series
              </Link>
            </div>
          </div>
        </div>

        {ranking.items.length > 0 ? (
          <RankingList items={ranking.items} />
        ) : (
          <div className="rounded-2xl p-12 text-center surface">
            <p className="text-sm font-medium">No ranking data available.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default RankingsPage;
