import { Skeleton } from '@/components/ui/skeleton';

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

export function PostPageSkeleton() {
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
