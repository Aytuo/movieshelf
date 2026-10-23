import { MediaCatalogHeader } from '@/components/catalog/media-catalog';
import {
  TvFeaturedCatalogSections,
  TvScheduleCatalogSections,
} from '@/components/catalog/streamed-catalog-sections';
import {
  TvFeaturedSectionsSkeleton,
  TvScheduleSectionsSkeleton,
} from '@/components/skeletons/catalog-page-skeletons';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'TV Series',
  description:
    'Discover TV series worth watching, from what is trending now to all-time favorites.',
};

export default function TvSeriesPage() {
  return (
    <main className="container-content py-12 lg:py-16">
      <MediaCatalogHeader
        eyebrow="Explore"
        title="TV Series"
        description="Discover what's worth watching, from what's trending now to all-time favorites."
      />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        <Suspense fallback={<TvFeaturedSectionsSkeleton />}>
          <TvFeaturedCatalogSections />
        </Suspense>

        <Suspense fallback={<TvScheduleSectionsSkeleton />}>
          <TvScheduleCatalogSections />
        </Suspense>
      </div>
    </main>
  );
}
