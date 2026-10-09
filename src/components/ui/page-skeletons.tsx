import { Skeleton } from './skeleton';

function PageHeaderSkeleton() {
  return (
    <header>
      <Skeleton className="h-3 w-20" />

      <Skeleton className="mt-3 h-10 w-64 max-w-full sm:h-11 sm:w-80" />

      <Skeleton className="mt-4 h-4 w-full max-w-2xl" />

      <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />
    </header>
  );
}

function MediaCardSkeleton() {
  return (
    <article>
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />

      <Skeleton className="mt-3 h-4 w-4/5" />

      <Skeleton className="mt-2 h-3 w-1/2" />
    </article>
  );
}

function MediaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, index) => (
        <MediaCardSkeleton key={index} />
      ))}
    </div>
  );
}

function MediaCarouselSkeleton() {
  return (
    <section>
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

function RankingListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="divide-y divide-border/60 border-y border-border/60">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex gap-4 py-5 sm:gap-6 sm:py-6">
          <div className="flex w-12 shrink-0 items-start justify-center pt-3 sm:w-16">
            <Skeleton className="h-9 w-10 sm:h-10 sm:w-12" />
          </div>

          <Skeleton className="h-30` w-20 shrink-0 rounded-lg sm:h-[150px] sm:w-25 sm:rounded-xl" />

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

function SearchResultsSkeleton() {
  return (
    <div className="mt-10 space-y-3">
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl p-3 surface"
        >
          <Skeleton className="size-14 shrink-0 rounded-lg" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-2/3 max-w-sm" />
            <Skeleton className="mt-2 h-3 w-1/3 max-w-xs" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MediaDetailsSkeleton() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-surface/30" />

        <div className="relative container-content py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
            <Skeleton className="mx-auto aspect-[2/3] w-full max-w-70 rounded-xl" />

            <div className="flex flex-col justify-center">
              <Skeleton className="h-4 w-32" />

              <Skeleton className="mt-4 h-12 w-full max-w-2xl sm:h-14 lg:h-16" />

              <Skeleton className="mt-4 h-4 w-48" />

              <div className="mt-6 flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>

              <div className="mt-7 max-w-2xl space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <Skeleton className="mt-7 h-12 w-56 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-7">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-8 w-32" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>
                <Skeleton className="aspect-[2/3] rounded-xl" />
                <Skeleton className="mt-3 h-4 w-4/5" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-8">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-8 w-40" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="rounded-2xl p-5 surface">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeSkeleton() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="container-content">
          <div className="grid min-h-[calc(100vh-var(--header-height))] items-center gap-16 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-20">
            <div className="max-w-2xl">
              <Skeleton className="h-7 w-48 rounded-full" />
              <Skeleton className="mt-6 h-16 w-full max-w-xl sm:h-20" />
              <Skeleton className="mt-3 h-16 w-4/5 max-w-lg sm:h-20" />
              <Skeleton className="mt-6 h-5 w-full max-w-xl" />
              <Skeleton className="mt-2 h-5 w-4/5 max-w-lg" />

              <div className="mt-8 flex gap-3">
                <Skeleton className="h-11 w-36 rounded-lg" />
                <Skeleton className="h-11 w-28 rounded-lg" />
              </div>

              <div className="mt-10 flex flex-wrap gap-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>

            <div className="relative mx-auto h-125 w-full max-w-140">
              <Skeleton className="absolute top-1/2 left-1/2 aspect-[2/3] w-52 -translate-x-1/2 -translate-y-1/2 rounded-xl" />
              <Skeleton className="absolute top-[15%] left-[10%] hidden aspect-[2/3] w-44 rotate-[-8deg] rounded-xl sm:block" />
              <Skeleton className="absolute top-[18%] right-[10%] hidden aspect-[2/3] w-44 rotate-[8deg] rounded-xl sm:block" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-content py-14 lg:py-16">
        <div className="mb-7">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-3 h-9 w-full max-w-3xl" />
          <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        </div>

        <Skeleton className="h-48 w-full rounded-2xl" />
      </section>

      <div className="container-content space-y-14 lg:space-y-20">
        <MediaCarouselSkeleton />
        <MediaCarouselSkeleton />
      </div>
    </main>
  );
}

export {
  HomeSkeleton,
  MediaCarouselSkeleton,
  MediaDetailsSkeleton,
  MediaGridSkeleton,
  PageHeaderSkeleton,
  RankingListSkeleton,
  SearchResultsSkeleton,
};
