import type { SearchMediaType } from '@/types';
import Link from 'next/link';

type SearchPaginationProps = {
  page: number;
  totalPages: number;
  query: string;
  type: SearchMediaType;
  year?: number;
};

const SearchPagination = ({
  page,
  totalPages,
  query,
  type,
  year,
}: SearchPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  function buildUrl(nextPage: number) {
    const params = new URLSearchParams();

    params.set('q', query);
    params.set('page', String(nextPage));

    if (type !== 'all') {
      params.set('type', type);
    }

    if (year !== undefined) {
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
