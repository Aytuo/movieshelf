import {
  PageHeaderSkeleton,
  SearchResultsSkeleton,
} from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
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
