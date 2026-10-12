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

function RankingListSkeleton({ count = 8 }: { count?: number }) {
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

        <TastePreviewSkeleton />
      </section>

      <div className="container-content space-y-14 lg:space-y-20">
        <RecommendationSectionSkeleton />
        <RecommendationSectionSkeleton />
      </div>
    </main>
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

function RecommendationSectionSkeleton() {
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

function RankedMediaGridSkeleton({ count = 10 }: { count?: number }) {
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

function TvScheduleCarouselSkeleton({ count = 5 }: { count?: number }) {
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

function PersonCreditGridSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="overflow-hidden rounded-2xl surface">
          <Skeleton className="aspect-[2/3] w-full rounded-none" />

          <div className="p-4">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-2 h-3 w-16" />
            <Skeleton className="mt-3 h-3 w-full" />
          </div>
        </article>
      ))}
    </div>
  );
}

function FilmographyRowsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl surface">
      <div className="hidden grid-cols-[80px_56px_1fr_72px] gap-4 border-b border-border/60 px-5 py-3 sm:grid">
        <Skeleton className="h-3 w-10" />
        <span />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-10 justify-self-end" />
      </div>

      <div className="divide-y divide-border/60">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[56px_48px_1fr_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[80px_56px_1fr_72px] sm:gap-4 sm:px-5"
          >
            <Skeleton className="h-4 w-8 sm:w-10" />

            <Skeleton className="h-16 w-11 rounded-md sm:h-18 sm:w-12" />

            <div className="min-w-0">
              <Skeleton className="h-4 w-full max-w-48" />
              <Skeleton className="mt-2 h-3 w-3/4 max-w-32" />
            </div>

            <Skeleton className="h-3 w-8 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonPageSkeleton() {
  return (
    <main>
      <section className="border-b border-border/60">
        <div className="container-content py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
            <div className="mx-auto w-full max-w-55">
              <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
                <Skeleton className="aspect-[2/3] w-full rounded-none" />
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>

              <Skeleton className="mt-3 h-11 w-full max-w-xl sm:h-12 lg:h-14" />

              <Skeleton className="mt-3 h-4 w-48 max-w-full" />

              <div className="mt-7 max-w-3xl space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <Skeleton className="h-8 w-16 rounded-lg" />
                <Skeleton className="h-8 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-content space-y-16 py-14 lg:space-y-20 lg:py-20">
          <section>
            <div className="mb-8">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-8 w-48" />
            </div>

            <PersonCreditGridSkeleton count={5} />
          </section>

          <section>
            <div className="mb-8">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-8 w-32" />
            </div>

            <div className="space-y-10">
              <div>
                <div className="mb-4 flex items-baseline gap-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <FilmographyRowsSkeleton count={4} />
              </div>

              <div>
                <div className="mb-4 flex items-baseline gap-4">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <FilmographyRowsSkeleton count={3} />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-8">
              <Skeleton className="h-8 w-40" />
            </div>

            <PersonCreditGridSkeleton count={5} />
          </section>
        </div>
      </section>
    </main>
  );
}

function PostCommentSkeleton() {
  return (
    <article className="rounded-2xl border border-border/60 bg-surface p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-9 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-32 max-w-full" />
          <Skeleton className="mt-2 h-3 w-40 max-w-full" />

          <div className="mt-4 rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>
    </article>
  );
}

function PostPageSkeleton() {
  return (
    <main className="container-content py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="-ml-3 inline-flex items-center gap-2 rounded-lg px-3 py-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="mt-8">
          <div className="mb-5">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </div>

          <article className="rounded-2xl p-6 surface sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />

                <div className="min-w-0">
                  <Skeleton className="h-4 w-32 max-w-full" />
                  <Skeleton className="mt-2 h-3 w-40 max-w-full" />
                </div>
              </div>

              <Skeleton className="mt-1 h-3 w-20 shrink-0" />
            </div>

            <Skeleton className="mt-6 h-9 w-full max-w-2xl sm:h-10" />

            <div className="mt-6 max-w-3xl space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border/60 pt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </article>

          <section className="mt-14 border-t border-border/60 pt-10 sm:mt-16 sm:pt-12">
            <div className="mb-8">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-8 w-40" />
            </div>

            <div className="mb-8">
              <Skeleton className="h-10 w-48 rounded-lg" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <PostCommentSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileMediaShelfSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="py-10 lg:py-14">
      <div className="mb-7">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-40" />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: count }, (_, index) => (
          <article key={index} className="min-w-0">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="mt-3 h-4 w-4/5" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfilePageSkeleton() {
  return (
    <main className="container-content py-12 lg:py-16">
      <header>
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-5">
            <Skeleton className="size-24 shrink-0 rounded-2xl" />

            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="mt-3 h-9 w-full max-w-sm sm:h-10" />
              <Skeleton className="mt-2 h-4 w-32" />

              <div className="mt-4 flex flex-wrap gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg" />
          <Skeleton className="h-9 w-20 rounded-lg" />
        </div>
      </header>

      <section className="py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <article key={index} className="rounded-2xl p-5 surface">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>

              <div className="mt-5 grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }, (_, statIndex) => (
                  <div key={statIndex}>
                    <Skeleton className="h-7 w-10 max-w-full" />
                    <Skeleton className="mt-2 h-3 w-12 max-w-full" />
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <ProfileMediaShelfSkeleton />
      <ProfileMediaShelfSkeleton />
    </main>
  );
}

function ProfileTabHeaderSkeleton() {
  return (
    <header>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-10 w-48 max-w-full sm:h-11" />

      <div className="mt-3 max-w-2xl space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-16 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </header>
  );
}

function ProfileActivityItemsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-5 hidden h-full w-px bg-border md:block" />

      <div className="space-y-6">
        {Array.from({ length: count }, (_, index) => (
          <article key={index} className="relative flex gap-5 md:gap-8">
            <Skeleton className="size-10 shrink-0 rounded-full" />

            <div className="flex min-w-0 flex-1 gap-4 rounded-2xl p-4 surface">
              <Skeleton className="aspect-[2/3] w-20 shrink-0 self-start rounded-lg" />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <Skeleton className="h-4 w-36 max-w-full" />
                  <Skeleton className="h-3 w-24 shrink-0" />
                </div>

                <Skeleton className="mt-3 h-4 w-3/4" />

                <div className="mt-5 space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfilePostCardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="rounded-2xl p-5 surface sm:p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-32 max-w-full" />
              <Skeleton className="mt-2 h-3 w-40 max-w-full" />
            </div>
          </div>

          <Skeleton className="mt-5 h-6 w-3/4 max-w-lg" />

          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-border/60 pt-4">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </article>
      ))}
    </div>
  );
}

function ProfileReviewCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="flex flex-col rounded-2xl p-5 surface">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="mt-2 h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-14 shrink-0" />
          </div>

          <Skeleton className="mt-4 h-5 w-2/3" />

          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          <Skeleton className="mt-5 h-3 w-32" />
        </article>
      ))}
    </div>
  );
}

function ProfileTasteContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex gap-2 rounded-lg border border-border bg-surface p-1">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      <section className="rounded-2xl border border-primary/15 bg-primary-muted p-6 sm:p-8">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="mt-4 h-8 w-full max-w-xl" />
        <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-4 w-4/5 max-w-xl" />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="rounded-xl p-4 surface">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-4 h-7 w-12" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl p-6 surface">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-2 h-3 w-full max-w-md" />
        <Skeleton className="mt-5 h-[6px] w-full rounded-full" />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="rounded-2xl p-6 surface">
            <Skeleton className="h-3 w-32" />

            <div className="mt-7 space-y-5">
              {Array.from({ length: 4 }, (_, rowIndex) => (
                <div key={rowIndex}>
                  <div className="mb-2 flex justify-between gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-[6px] w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

type ProfileTabSkeletonVariant = 'activity' | 'posts' | 'reviews' | 'taste';

function ProfileTabSkeleton({
  variant,
}: {
  variant: ProfileTabSkeletonVariant;
}) {
  return (
    <main className="container-content py-12 lg:py-16">
      <ProfileTabHeaderSkeleton />

      <section className="py-10 lg:py-14">
        {variant === 'activity' && <ProfileActivityItemsSkeleton />}
        {variant === 'posts' && <ProfilePostCardsSkeleton />}
        {variant === 'reviews' && <ProfileReviewCardsSkeleton />}
        {variant === 'taste' && <ProfileTasteContentSkeleton />}
      </section>
    </main>
  );
}

function FollowListRowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-border/50">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 px-4 py-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="min-w-0">
              <Skeleton className="h-4 w-28 max-w-full" />
              <Skeleton className="mt-2 h-3 w-36 max-w-full" />
            </div>
          </div>

          <Skeleton className="h-9 w-24 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function FollowListSkeleton({
  variant = 'page',
}: {
  variant?: 'page' | 'modal';
}) {
  if (variant === 'modal') {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      >
        <div className="max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border/60 px-6 py-5">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-2 h-3 w-48 max-w-full" />
          </div>
          <div className="px-1 py-2">
            <FollowListRowsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="container-content py-10 lg:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="inline-flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="mt-8 mb-7">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-9 w-40" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <FollowListRowsSkeleton />
        </div>
      </div>
    </main>
  );
}

export {
  FollowListSkeleton,
  HomeSkeleton,
  MediaCarouselSkeleton,
  MediaDetailsSkeleton,
  MediaGridSkeleton,
  PageHeaderSkeleton,
  PersonPageSkeleton,
  PostPageSkeleton,
  ProfilePageSkeleton,
  ProfileTabSkeleton,
  RankedMediaGridSkeleton,
  RankingListSkeleton,
  SearchResultsSkeleton,
  TvScheduleCarouselSkeleton,
};
