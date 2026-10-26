import { Skeleton } from '../ui/skeleton';

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

export function ProfilePageSkeleton() {
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
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="size-4 shrink-0 rounded-sm" />
                      <Skeleton className="h-7 w-10 max-w-full" />
                    </div>

                    <Skeleton className="mt-1 h-3 w-12 max-w-full" />
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-4">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }, (_, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Skeleton className="size-3.5 shrink-0 rounded-sm" />
                        <Skeleton className="h-5 w-8" />
                      </div>

                      <Skeleton className="mx-auto mt-1 h-3 w-12 max-w-full" />
                    </div>
                  ))}
                </div>
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

            <div className="mt-4 flex min-h-7 items-center justify-center gap-1.5">
              <Skeleton className="h-7 w-12" />

              {index === 3 && (
                <Skeleton className="size-3.5 shrink-0 rounded-full" />
              )}
            </div>
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

      {/* Rating distribution */}
      <section className="rounded-2xl p-6 surface sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-2 h-4 w-56 max-w-full" />
          </div>

          <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
        </div>

        <div className="mt-8 flex h-56 items-stretch gap-1 sm:gap-3">
          {Array.from({ length: 10 }, (_, index) => {
            const height = [14, 24, 36, 52, 68, 78, 64, 46, 30, 18][index];

            return (
              <div key={index} className="flex min-w-0 flex-1 flex-col">
                <div className="relative min-h-0 flex-1">
                  <Skeleton
                    className="absolute left-1/2 h-2 w-3 -translate-x-1/2"
                    style={{
                      bottom: `calc(${height}% + 6px)`,
                    }}
                  />

                  <Skeleton
                    className="absolute inset-x-0 bottom-0 rounded-t-md"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>

                <Skeleton className="mx-auto mt-2 h-2.5 w-3" />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type ProfileTabSkeletonVariant = 'activity' | 'posts' | 'reviews' | 'taste';

export function ProfileTabSkeleton({
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

export function FollowListSkeleton({
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
