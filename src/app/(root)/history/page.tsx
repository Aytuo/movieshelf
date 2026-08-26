import { requireSession } from '@/lib/auth/require-session';
import { getUserWatchHistory } from '@/lib/services/watch-history-service';

const HistoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) => {
  const session = await requireSession();
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const result = await getUserWatchHistory(session.user.id, page);

  return (
    <main className="container-content py-10 lg:py-14">
      <header>
        <p className="eyebrow">Your cinema</p>

        <h1 className="mt-2 font-heading text-3xl font-bold">Watch history</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Every movie you&apos;ve watched, including rewatches.
        </p>
      </header>

      <div className="mt-10">
        {result.items.length === 0 ? (
          <EmptyHistory />
        ) : (
          <HistoryGrid items={result.items} />
        )}
      </div>

      {result.totalPages > 1 && (
        <HistoryPagination page={result.page} totalPages={result.totalPages} />
      )}
    </main>
  );
};

export default HistoryPage;
