import { Skeleton } from '@/components/ui/skeleton';

export function OnboardingSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container-content py-8 sm:py-10">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight">
            Movie<span className="text-primary">Shelf</span>
          </span>

          <Skeleton className="h-3 w-12" />
        </div>

        <div className="mx-auto max-w-4xl pt-16 pb-12 sm:pt-20">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="mt-4 h-10 w-full max-w-lg sm:h-12" />
          <Skeleton className="mt-2 h-10 w-4/5 max-w-md sm:h-12" />

          <div className="mt-5 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-surface-hover">
              <Skeleton className="h-full w-1/5 rounded-full" />
            </div>

            <Skeleton className="h-3 w-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className="relative aspect-[2/3] overflow-hidden rounded-xl"
            >
              <Skeleton className="size-full rounded-xl" />

              <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-background/80 to-transparent p-3 pt-10">
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-2 w-1/3" />
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-4 z-30 mt-10 flex flex-col items-center">
          <Skeleton className="h-12 w-56 max-w-full rounded-lg" />
          <Skeleton className="mt-3 h-3 w-28" />
        </div>
      </div>
    </div>
  );
}
