import { Skeleton } from '@/components/ui/skeleton';

export function NotificationsPageSkeleton() {
  return (
    <main className="container-content py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-2 h-9 w-48 max-w-full" />
            <Skeleton className="mt-2 h-4 w-80 max-w-full" />
          </div>

          <div className="flex shrink-0 items-center gap-4 pb-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <div className="divide-y divide-border/50">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="flex items-start gap-4 px-5 py-4">
                <Skeleton className="size-9 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-3/4 max-w-full" />
                  <Skeleton className="mt-1 h-3 w-1/3 max-w-full" />
                </div>

                <Skeleton className="mt-2 size-2 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Skeleton className="h-11 w-52 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
