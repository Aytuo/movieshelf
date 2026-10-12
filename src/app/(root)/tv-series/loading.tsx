import {
  MediaCarouselSkeleton,
  PageHeaderSkeleton,
  RankedMediaGridSkeleton,
  TvScheduleCarouselSkeleton,
} from '@/components/ui/page-skeletons';

export default function Loading() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        {/* Most popular */}
        <MediaCarouselSkeleton />

        {/* Trending */}
        <MediaCarouselSkeleton />

        {/* Weekly top 10 */}
        <RankedMediaGridSkeleton count={10} />

        {/* Airing today */}
        <TvScheduleCarouselSkeleton />

        {/* Currently airing */}
        <TvScheduleCarouselSkeleton />

        {/* Top rated */}
        <MediaCarouselSkeleton />
      </div>
    </main>
  );
}
