import {
  MediaCarouselSkeleton,
  PageHeaderSkeleton,
  RankingListSkeleton,
} from '@/components/ui/page-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        <MediaCarouselSkeleton />
        <MediaCarouselSkeleton />

        <section>
          <div className="mb-7">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-56" />
            <Skeleton className="mt-2 h-4 w-80 max-w-full" />
          </div>

          <RankingListSkeleton count={6} />
        </section>

        <MediaCarouselSkeleton />
        <MediaCarouselSkeleton />
        <MediaCarouselSkeleton />
      </div>
    </main>
  );
}
