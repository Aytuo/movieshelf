import {
  HomeHeroSection,
  HomeMovieRecommendationsSection,
  HomeTasteSection,
  HomeTvRecommendationsSection,
} from '@/components/home/home-streamed-sections';
import {
  HomeHeroSectionSkeleton,
  HomeRecommendationSectionSkeleton,
  HomeTasteSectionSkeleton,
} from '@/components/skeletons/home-skeletons';
import { requireSession } from '@/lib/auth/require-session';
import { Suspense } from 'react';

export default async function HomePage() {
  const session = await requireSession();

  return (
    <>
      <Suspense fallback={<HomeHeroSectionSkeleton />}>
        <HomeHeroSection userId={session.user.id} />
      </Suspense>

      <main>
        <Suspense fallback={<HomeTasteSectionSkeleton />}>
          <HomeTasteSection
            userId={session.user.id}
            userName={session.user.name}
          />
        </Suspense>

        <Suspense fallback={<HomeRecommendationSectionSkeleton />}>
          <HomeMovieRecommendationsSection userId={session.user.id} />
        </Suspense>

        <Suspense fallback={<HomeRecommendationSectionSkeleton />}>
          <HomeTvRecommendationsSection userId={session.user.id} />
        </Suspense>
      </main>
    </>
  );
}
