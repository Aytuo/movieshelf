import { Skeleton } from '../ui/skeleton';
import { MediaCardSkeleton } from './shared-skeletons';

function MediaRecommendationSectionSkeleton() {
  return (
    <section className="container-content py-14 lg:py-20">
      <div className="mb-7">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-48 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <MediaCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export function MediaDetailsSkeleton({ type }: { type: 'movie' | 'tv' }) {
  const isTv = type === 'tv';

  return (
    <main>
      {/* Hero: poster + media details */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-surface/30" />

        <div className="relative container-content py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
            <Skeleton className="mx-auto aspect-[2/3] w-full max-w-70 rounded-xl" />

            <div className="flex min-w-0 flex-col justify-center">
              <Skeleton className="h-4 w-40" />

              <Skeleton className="mt-4 h-12 w-full max-w-2xl sm:h-14 lg:h-16" />

              <Skeleton className="mt-3 h-4 w-64 max-w-full" />

              <div className="mt-5 flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>

              <div className="mt-7 max-w-2xl space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {isTv ? (
                <>
                  {/* TV-specific metadata */}
                  <div className="mt-7 grid gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }, (_, index) => (
                      <div key={index}>
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="mt-2 h-4 w-24" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-2 h-4 w-48 max-w-full" />
                  </div>
                </>
              ) : (
                /* Movie-specific crew */
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 2 }, (_, index) => (
                    <div key={index}>
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="mt-2 h-4 w-40 max-w-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* TMDB rating */}
              <div className="mt-7 flex items-center gap-3">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-3 w-28" />
              </div>

              {/* User actions */}
              <div className="mt-7 flex flex-wrap gap-2">
                <Skeleton className="h-11 w-32 rounded-lg" />
                <Skeleton className="h-11 w-28 rounded-lg" />
                <Skeleton className="h-11 w-28 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TV seasons — present only for the TV variant */}
      {isTv && (
        <section className="border-t border-border/60 bg-surface/20">
          <div className="container-content py-14 lg:py-20">
            <div className="mb-8">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-2 h-8 w-32" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, index) => (
                <article
                  key={index}
                  className="flex gap-4 overflow-hidden rounded-2xl border border-border/60 bg-surface p-4 sm:gap-6 sm:p-5"
                >
                  <Skeleton className="aspect-[2/3] w-28 shrink-0 rounded-xl sm:w-32 lg:w-36" />

                  <div className="min-w-0 flex-1 self-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-3 h-6 w-48 max-w-full sm:h-7" />
                    <Skeleton className="mt-2 h-4 w-24" />

                    <div className="mt-3 hidden max-w-2xl space-y-2 sm:block">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-4/5" />
                    </div>
                  </div>

                  <Skeleton className="mt-2 size-9 shrink-0 rounded-full" />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cast */}
      <section className="border-t border-border/60">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-7">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-8 w-32" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }, (_, index) => (
              <article key={index}>
                <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                <Skeleton className="mt-3 h-4 w-4/5" />
                <Skeleton className="mt-2 h-3 w-3/5" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Trailer */}
      <section className="border-t border-border/60 bg-surface/20">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-7">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-8 w-28" />
          </div>

          <Skeleton className="mx-auto aspect-video w-full max-w-5xl rounded-2xl" />
        </div>
      </section>

      {/* Your review */}
      <section className="scroll-mt-24 border-t border-border/60">
        <div className="container-content py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-8 w-32" />

              <div className="mt-3 max-w-md space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            <div className="rounded-2xl p-5 surface sm:p-7">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-4 h-10 w-full rounded-lg" />
              <Skeleton className="mt-3 h-24 w-full rounded-lg" />

              <div className="mt-5 flex flex-wrap justify-between gap-3">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community reviews */}
      <section className="border-t border-border/60 bg-surface/20">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-8">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-8 w-32" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <article key={index} className="rounded-2xl p-5 surface">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-full" />

                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </div>
                  </div>

                  <Skeleton className="h-4 w-14" />
                </div>

                <Skeleton className="mt-5 h-5 w-2/3" />

                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                <Skeleton className="mt-5 h-3 w-24" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Community discussion */}
      <section className="border-t border-border/60">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-8">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-8 w-40" />
            <Skeleton className="mt-2 h-4 w-full max-w-xl" />
          </div>

          {/* Post composer */}
          <div className="rounded-2xl p-5 surface sm:p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-3 h-20 w-full rounded-xl" />

                <div className="mt-4 flex justify-end">
                  <Skeleton className="h-9 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Existing posts */}
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <article key={index} className="rounded-2xl p-5 surface sm:p-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 shrink-0 rounded-full" />

                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-2 h-3 w-40" />
                  </div>
                </div>

                <Skeleton className="mt-5 h-5 w-3/4 max-w-lg" />

                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                <div className="mt-5 flex flex-wrap gap-4 border-t border-border/60 pt-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="border-t border-border/60 bg-surface/20">
        <MediaRecommendationSectionSkeleton />
        <MediaRecommendationSectionSkeleton />
      </section>
    </main>
  );
}
