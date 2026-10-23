import { Skeleton } from '@/components/ui/skeleton';
import { PageHeaderSkeleton } from './shared-skeletons';

export function PeopleSearchCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex h-24 items-center gap-4 rounded-2xl p-4 surface"
        >
          <Skeleton className="size-16 shrink-0 rounded-xl" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="mt-10 space-y-12">
      {/* Movies and TV series */}
      <section>
        <Skeleton className="mb-5 h-6 w-32" />

        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }, (_, index) => (
            <article key={index}>
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-2 h-3 w-1/2" />
            </article>
          ))}
        </div>
      </section>

      {/* People */}
      <section>
        <Skeleton className="mb-5 h-6 w-20" />

        <PeopleSearchCardsSkeleton count={4} />
      </section>
    </div>
  );
}

export function SearchPageSkeleton() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <section className="py-10 lg:py-14">
        <div className="grid gap-3 sm:grid-cols-[1fr_160px_140px_auto]">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-28 rounded-lg" />
        </div>

        <div className="mt-10">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="mt-2 h-8 w-64 max-w-full" />
        </div>

        <SearchResultsSkeleton />
      </section>
    </main>
  );
}
