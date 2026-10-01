import HistoryCard from '@/components/history/history-card';
import HistoryPagination from '@/components/history/history-pagination';
import EmptyState from '@/components/ui/empty-state';
import { requireSession } from '@/lib/auth/require-session';
import { getUserWatchHistory } from '@/lib/services/watch-history-service';
import { ArrowRight, Clock3 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

type HistoryPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Watch History',
  description: 'Review everything you have marked as watched on MovieShelf.',
};

const HistoryPage = async ({ searchParams }: HistoryPageProps) => {
  const session = await requireSession();
  const params = await searchParams;
  const parsed = Number(params.page);
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
  const result = await getUserWatchHistory(session.user.id, page);

  return (
    <main className="container-content py-12 lg:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your journey</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Watch history
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Every movie and TV series you&apos;ve watched, including rewatches.
          </p>
        </div>

        <Link
          href="/activity"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Activity
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <section className="py-10 lg:py-14">
        {result.items.length > 0 ? (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {result.items.map((item) => (
                <HistoryCard key={item.history.id} item={item} />
              ))}
            </div>

            <HistoryPagination
              page={result.page}
              totalPages={result.totalPages}
            />
          </>
        ) : (
          <div className="rounded-2xl p-12 text-center surface">
            <EmptyState
              icon={Clock3}
              title="Your history is empty"
              description="Mark a movie or TV series as watched and it will appear here."
              action={
                <Link
                  href="/discover"
                  className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Discover
                </Link>
              }
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default HistoryPage;
