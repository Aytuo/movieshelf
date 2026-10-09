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
        <div className="mb-10 space-y-4">
          <div>
            <Skeleton className="mb-2 h-3 w-14" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-9 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="mb-2 h-3 w-14" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-9 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        <MediaGridSkeleton count={12} />
      </section>
    </main>
  );
}
