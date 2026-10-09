import {
  MediaGridSkeleton,
  PageHeaderSkeleton,
} from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <section className="py-10 lg:py-14">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <Skeleton className="h-130 w-full rounded-2xl" />
          </aside>

          <div className="min-w-0">
            <Skeleton className="mb-6 h-4 w-40" />
            <MediaGridSkeleton count={12} />
          </div>
        </div>
      </section>
    </main>
  );
}
