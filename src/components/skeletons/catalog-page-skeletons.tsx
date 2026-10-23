import {
  MediaCarouselSkeleton,
  RankedMediaGridSkeleton,
  RankingListSkeleton,
  TvScheduleCarouselSkeleton,
} from '@/components/skeletons/catalog-skeletons';
import {
  MediaGridSkeleton,
  PageHeaderSkeleton,
} from '@/components/skeletons/shared-skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export function DiscoverPageSkeleton() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <section className="py-10 lg:py-14">
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="mb-4 flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside>
            <Skeleton className="h-150 w-full rounded-2xl" />
          </aside>

          <div className="min-w-0">
            <Skeleton className="mb-6 h-4 w-40" />
            <MediaGridSkeleton count={10} xlColumns={5} />
          </div>
        </div>
      </section>
    </main>
  );
}

export function ShelfPageSkeleton() {
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

export function MoviesPageSkeleton() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        <MoviesFeaturedSectionsSkeleton />
        <MoviesReleaseSectionsSkeleton />
      </div>
    </main>
  );
}

export function TvSeriesPageSkeleton() {
  return (
    <main className="container-content py-12 lg:py-16">
      <PageHeaderSkeleton />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        <TvFeaturedSectionsSkeleton />
        <TvScheduleSectionsSkeleton />
      </div>
    </main>
  );
}

export function RankingsPageSkeleton() {
  return (
    <main className="container-content py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <PageHeaderSkeleton />

        <div className="mt-6 flex justify-end">
          <div className="inline-flex gap-1 rounded-lg border border-border bg-surface p-1">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>

        <div className="mt-10">
          <RankingListSkeleton count={10} />
        </div>
      </div>
    </main>
  );
}

export function MoviesFeaturedSectionsSkeleton() {
  return (
    <div className="space-y-14 lg:space-y-20">
      <MediaCarouselSkeleton />
      <MediaCarouselSkeleton />
      <RankedMediaGridSkeleton count={10} />
    </div>
  );
}

export function MoviesReleaseSectionsSkeleton() {
  return (
    <div className="space-y-14 lg:space-y-20">
      <MediaCarouselSkeleton />
      <MediaCarouselSkeleton />
      <MediaCarouselSkeleton />
    </div>
  );
}

export function TvFeaturedSectionsSkeleton() {
  return (
    <div className="space-y-14 lg:space-y-20">
      <MediaCarouselSkeleton />
      <MediaCarouselSkeleton />
      <RankedMediaGridSkeleton count={10} />
    </div>
  );
}

export function TvScheduleSectionsSkeleton() {
  return (
    <div className="space-y-14 lg:space-y-20">
      <TvScheduleCarouselSkeleton />
      <TvScheduleCarouselSkeleton />
      <MediaCarouselSkeleton />
    </div>
  );
}
