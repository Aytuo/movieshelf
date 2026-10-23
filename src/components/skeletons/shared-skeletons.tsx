import { Skeleton } from '@/components/ui/skeleton';

export function PageHeaderSkeleton() {
  return (
    <header>
      <Skeleton className="h-3 w-20" />

      <Skeleton className="mt-3 h-10 w-64 max-w-full sm:h-11 sm:w-80" />

      <Skeleton className="mt-4 h-4 w-full max-w-2xl" />

      <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />
    </header>
  );
}

export function MediaCardSkeleton() {
  return (
    <article>
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />

      <Skeleton className="mt-3 h-4 w-4/5" />

      <Skeleton className="mt-2 h-3 w-1/2" />
    </article>
  );
}

export function MediaGridSkeleton({
  count = 12,
  xlColumns = 6,
}: {
  count?: number;
  xlColumns?: 5 | 6;
}) {
  const gridClassName =
    xlColumns === 5
      ? 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
      : 'grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

  return (
    <div className={gridClassName}>
      {Array.from({ length: count }, (_, index) => (
        <MediaCardSkeleton key={index} />
      ))}
    </div>
  );
}
