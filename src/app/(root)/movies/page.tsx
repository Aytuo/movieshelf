import { MediaCatalogHeader } from '@/components/catalog/media-catalog';
import {
  MovieFeaturedCatalogSections,
  MovieReleaseCatalogSections,
} from '@/components/catalog/streamed-catalog-sections';
import {
  MoviesFeaturedSectionsSkeleton,
  MoviesReleaseSectionsSkeleton,
} from '@/components/skeletons/catalog-page-skeletons';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Movies',
  description:
    'Discover movies worth watching, from what is trending now to timeless favorites.',
};

export default function MoviesPage() {
  return (
    <main className="container-content py-12 lg:py-16">
      <MediaCatalogHeader
        eyebrow="Explore"
        title="Movies"
        description="Discover what's worth watching, from what's trending now to timeless favorites."
      />

      <div className="mt-10 space-y-14 lg:mt-14 lg:space-y-20">
        <Suspense fallback={<MoviesFeaturedSectionsSkeleton />}>
          <MovieFeaturedCatalogSections />
        </Suspense>

        <Suspense fallback={<MoviesReleaseSectionsSkeleton />}>
          <MovieReleaseCatalogSections />
        </Suspense>
      </div>
    </main>
  );
}
