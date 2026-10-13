'use client';

import { buildDiscoverUrl } from '@/lib/discover/build-url';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type DiscoverPaginationProps = {
  page: number;
  totalPages: number;
  totalPagesKnown?: boolean;
  canGoNext?: boolean;
};

const DiscoverPagination = ({
  page,
  totalPages,
  totalPagesKnown = true,
  canGoNext,
}: DiscoverPaginationProps) => {
  const searchParams = useSearchParams();

  const previous = page > 1 ? buildDiscoverUrl(searchParams, page - 1) : null;

  const canNavigateNext = canGoNext ?? page < totalPages;

  const next = canNavigateNext
    ? buildDiscoverUrl(searchParams, page + 1)
    : null;

  return (
    <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6">
      {previous ? (
        <Link
          href={previous}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
        >
          ← Previous
        </Link>
      ) : (
        <span />
      )}

      <span className="text-xs text-muted-foreground">
        {totalPagesKnown ? `Page ${page} of ${totalPages}` : `Page ${page}`}
      </span>

      {next ? (
        <Link
          href={next}
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

export default DiscoverPagination;
