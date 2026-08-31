import Link from 'next/link';

type HistoryPaginationProps = {
  page: number;
  totalPages: number;
};

const HistoryPagination = ({ page, totalPages }: HistoryPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
      {page > 1 ? (
        <Link
          href={`/history?page=${page - 1}`}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={`/history?page=${page + 1}`}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
        >
          Next →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
};

export default HistoryPagination;
