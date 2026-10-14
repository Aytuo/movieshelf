'use client';

import { buildDiscoverUrl } from '@/lib/discover/build-url';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
        >
          <ArrowLeft className="size-4" />
          Previous
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
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
        >
          Next
          <ArrowRight className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
};

export default DiscoverPagination;
