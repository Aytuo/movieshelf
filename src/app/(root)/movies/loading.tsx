import {
  MediaCarouselSkeleton,
  PageHeaderSkeleton,
  RankingListSkeleton,
} from '@/components/ui/page-skeletons';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        <MediaCarouselSkeleton />
        <MediaCarouselSkeleton />

        <section>
          <div className="mb-7">
            <MediaCarouselSkeleton />
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
