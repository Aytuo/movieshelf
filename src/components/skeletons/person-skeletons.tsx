import { Skeleton } from '@/components/ui/skeleton';

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

function PersonCreditSectionSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section>
      <div className="mb-8">
        <Skeleton className="h-8 w-44" />
      </div>

      <PersonCreditGridSkeleton count={count} />
    </section>
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

export function PersonPageSkeleton() {
  return (
    <main>
      {/* Person header */}
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

      {/* Filmography and credits */}
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

          <PersonCreditSectionSkeleton count={4} />
          <PersonCreditSectionSkeleton count={4} />
          <PersonCreditSectionSkeleton count={4} />
          <PersonCreditSectionSkeleton count={4} />
        </div>
      </section>
    </main>
  );
}
