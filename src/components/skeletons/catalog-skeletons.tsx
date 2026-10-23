import { MediaCardSkeleton } from '@/components/skeletons/shared-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export function MediaCarouselSkeleton() {
  return (
    <section className="py-10 lg:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-8 w-56 max-w-[70vw]" />
          <Skeleton className="mt-2 h-4 w-80 max-w-[85vw]" />
        </div>

        <div className="hidden gap-2 sm:flex">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>

      <div className="-mx-1 flex gap-4 overflow-hidden px-1">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="w-[155px] shrink-0 sm:w-45 lg:w-50">
            <MediaCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RankingListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="divide-y divide-border/60 border-y border-border/60">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex gap-4 py-5 sm:gap-6 sm:py-6">
          <div className="flex w-12 shrink-0 items-start justify-center pt-3 sm:w-16">
            <Skeleton className="h-9 w-10 sm:h-10 sm:w-12" />
          </div>

          <Skeleton className="h-30 w-20 shrink-0 rounded-lg sm:h-[150px] sm:w-25 sm:rounded-xl" />

          <div className="min-w-0 flex-1 py-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-3/4 max-w-sm" />
            <Skeleton className="mt-3 h-4 w-32" />
            <Skeleton className="mt-3 h-3 w-full max-w-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RankedMediaGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <section className="overflow-hidden border-y border-border/60 py-16 lg:py-24">
      <div className="container-content">
        <div className="mb-12 max-w-2xl">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-9 w-full max-w-xl" />
          <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: count }, (_, index) => (
            <div
              key={index}
              className="relative isolate min-h-60 overflow-hidden rounded-2xl border border-border/60 bg-surface"
            >
              <div className="relative z-10 flex min-h-60 items-center gap-5 p-5 sm:p-6">
                <Skeleton className="h-[190px] w-32 shrink-0 rounded-xl" />

                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-8" />
                  <Skeleton className="mt-3 h-6 w-full max-w-xs" />
                  <Skeleton className="mt-2 h-6 w-4/5 max-w-xs" />
                  <Skeleton className="mt-5 h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="mt-6 h-3 w-64 max-w-full" />
      </div>
    </section>
  );
}

export function TvScheduleCarouselSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section className="py-10 lg:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-56 max-w-[70vw]" />
          <Skeleton className="mt-2 h-4 w-80 max-w-[85vw]" />
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </div>

      <div className="-mx-1 flex gap-4 overflow-hidden px-1 pb-2">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="w-[290px] shrink-0 sm:w-[320px]">
            <article className="flex h-full flex-col">
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
                <div className="relative aspect-video overflow-hidden bg-surface-hover">
                  <Skeleton className="h-full w-full rounded-none" />
                </div>

                <div className="flex h-37 flex-col p-4 sm:h-39">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="mt-2 h-3 w-24" />
                  <Skeleton className="mt-3 h-5 w-4/5" />
                  <Skeleton className="mt-2 h-5 w-3/5" />
                  <Skeleton className="mt-auto h-4 w-2/3" />
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
