import { Skeleton } from '../ui/skeleton';

export function HomeSkeleton() {
  return (
    <main>
      <HomeHeroSectionSkeleton />
      <HomeTasteSectionSkeleton />
      <HomeRecommendationSectionSkeleton />
      <HomeRecommendationSectionSkeleton />
    </main>
  );
}

export function HomeHeroSectionSkeleton() {
  return (
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

          <div className="relative mx-auto h-125 w-full max-w-140 sm:h-140">
            <Skeleton className="absolute top-4 left-1/2 z-20 aspect-[2/3] w-45 -translate-x-1/2 rotate-[1deg] rounded-xl sm:top-0 sm:w-[210px] lg:top-4 lg:w-[230px]" />

            <Skeleton className="absolute top-16 left-0 hidden aspect-[2/3] w-45 rotate-[-10deg] rounded-xl sm:block sm:w-[210px] lg:top-20 lg:left-8 lg:w-[230px]" />

            <Skeleton className="absolute top-20 right-0 hidden aspect-[2/3] w-45 rotate-[9deg] rounded-xl sm:block sm:w-[210px] lg:top-24 lg:right-8 lg:w-[230px]" />

            <div className="absolute right-2 bottom-2 z-30 hidden w-64 rounded-xl p-4 glass-strong sm:block lg:right-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-8 w-12" />
                  <Skeleton className="mt-1 h-3 w-32 max-w-full" />
                </div>

                <div className="flex shrink-0 -space-x-2">
                  <Skeleton className="size-8 rounded-full border-2 border-background" />
                  <Skeleton className="size-8 rounded-full border-2 border-background" />
                  <Skeleton className="size-8 rounded-full border-2 border-background" />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index}>
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="mt-2 h-3 w-12 max-w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeTasteSectionSkeleton() {
  return (
    <section className="border-b border-border/60">
      <div className="container-content py-14 lg:py-16">
        <div className="mb-7">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-9 w-full max-w-3xl" />
          <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        </div>

        <TastePreviewSkeleton />
      </div>
    </section>
  );
}

function TastePreviewSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-primary/15 bg-primary-muted">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border/60 bg-background/40 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>

              <div className="mt-5">
                <Skeleton className="h-3 w-20" />

                <div className="mt-3 flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>

              <div className="mt-6">
                <Skeleton className="h-3 w-24" />

                <div className="mt-3 flex gap-3">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeRecommendationSectionSkeleton() {
  return (
    <section className="container-content py-14 lg:py-20">
      <div className="mb-7">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-3 h-8 w-56 max-w-full" />
        <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <article key={index}>
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="mt-3 h-4 w-4/5" />
            <Skeleton className="mt-1 h-3 w-full max-w-[90%]" />
          </article>
        ))}
      </div>
    </section>
  );
}
