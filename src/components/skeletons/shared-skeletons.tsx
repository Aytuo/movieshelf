import { Skeleton } from '@/components/ui/skeleton';

export function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-content">
        <div className="flex h-(--header-height) items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-lg md:hidden" />

            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-4 w-16" />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}

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

type PageHeaderAction = 'activity' | 'watch-history';

export function PageHeaderWithActionSkeleton({
  action,
}: {
  action: PageHeaderAction;
}) {
  return (
    <header>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3 w-20" />

          <Skeleton className="mt-2 h-10 w-64 max-w-full sm:h-11 sm:w-80" />

          <div className="mt-3 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 max-w-xl" />
          </div>
        </div>

        <Skeleton
          className={
            action === 'watch-history'
              ? 'h-4 w-28 shrink-0'
              : 'h-4 w-20 shrink-0'
          }
        />
      </div>
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
