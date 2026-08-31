import HistoryCard from '@/components/history/history-card';
import HistoryPagination from '@/components/history/history-pagination';
import { requireSession } from '@/lib/auth/require-session';
import { getUserWatchHistory } from '@/lib/services/watch-history-service';
import { Clock3 } from 'lucide-react';

type HistoryPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const HistoryPage = async ({ searchParams }: HistoryPageProps) => {
  const session = await requireSession();

  const params = await searchParams;

  const parsed = Number(params.page);

  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;

  const result = await getUserWatchHistory(session.user.id, page);

  return (
    <main className="container-content py-10 lg:py-14">
      <header>
        <p className="eyebrow">Your journey</p>

        <h1 className="mt-2 font-heading text-3xl font-bold">Watch history</h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Every movie and TV series you&apos;ve watched, including rewatches.
        </p>
      </header>

      {result.items.length > 0 ? (
        <>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
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
        <div className="mt-10 rounded-2xl p-12 text-center surface">
          <Clock3 className="mx-auto size-6 text-muted-foreground" />

          <h2 className="mt-4 font-heading text-xl font-semibold">
            Your history is empty
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Mark a movie or TV series as watched and it will appear here.
          </p>
        </div>
      )}
    </main>
  );
};

export default HistoryPage;
