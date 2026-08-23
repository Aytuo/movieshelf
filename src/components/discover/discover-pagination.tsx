'use client';

import { buildDiscoverUrl } from '@/lib/discover/build-url';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const DiscoverPagination = ({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) => {
  const searchParams = useSearchParams();

  const previous = page > 1 ? buildDiscoverUrl(searchParams, page - 1) : null;

  const next =
    page < totalPages ? buildDiscoverUrl(searchParams, page + 1) : null;

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
        Page {page} of {totalPages}
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
