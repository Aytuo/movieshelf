import Link from 'next/link';

const SearchPagination = ({
  page,
  totalPages,
  query,
  year,
}: {
  page: number;
  totalPages: number;
  query: string;
  year?: number;
}) => {
  if (totalPages <= 1) {
    return null;
  }

  function buildUrl(nextPage: number) {
    const params = new URLSearchParams();

    params.set('q', query);
    params.set('page', String(nextPage));

    if (year) {
      params.set('year', String(year));
    }

    return `/search?${params.toString()}`;
  }

  return (
    <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
      {page > 1 ? (
        <Link
          href={buildUrl(page - 1)}
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
          href={buildUrl(page + 1)}
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

export default SearchPagination;
