import Hero from '@/components/home/hero';
import RecommendationSection from '@/components/recommendations/recommendation-section';
import TastePreview from '@/components/taste/taste-preview';
import { getColdStartRecommendations } from '@/lib/recommendations/cold-start';
import { getUserHomeSummary } from '@/lib/services/media-interaction-service';
import { getProfileOnboardingState } from '@/lib/services/profile-service';
import { getRecommendationsForUser } from '@/lib/services/recommendation-service';
import { getTasteProfile } from '@/lib/services/taste-service';
import Link from 'next/link';

type HomeSectionProps = {
  userId: string;
};

export async function HomeHeroSection({ userId }: HomeSectionProps) {
  const summary = await getUserHomeSummary(userId);

  return <Hero summary={summary} />;
}

type HomeTasteSectionProps = {
  userId: string;
  userName: string | null | undefined;
};

export async function HomeTasteSection({
  userId,
  userName,
}: HomeTasteSectionProps) {
  const [profile, taste] = await Promise.all([
    getProfileOnboardingState(userId),
    getTasteProfile(userId),
  ]);

  return (
    <>
      {profile && !profile.onboardingCompleted && (
        <section className="container-content pt-10 lg:pt-12">
          <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-muted p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Finish setting up your profile
              </p>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Complete your onboarding to help MovieShelf understand your
                taste and personalize your recommendations.
              </p>
            </div>

            <Link
              href="/onboarding"
              className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Complete onboarding
            </Link>
          </div>
        </section>
      )}

      <section className="border-b border-border/60">
        <div className="container-content py-14 lg:py-16">
          <div className="mb-7">
            <p className="eyebrow">Your taste</p>

            <h1 className="mt-2 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Your shelf is becoming your cinematic identity
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              See what your ratings say about you, then discover what might
              belong on your shelf next.
            </p>
          </div>

          <TastePreview
            taste={taste}
            username={profile?.username ?? userName ?? 'profile'}
          />
        </div>
      </section>
    </>
  );
}

async function getHomeRecommendations(userId: string, type: 'movie' | 'tv') {
  const personalized = await getRecommendationsForUser(userId, type);

  if (personalized.length > 0) {
    return {
      recommendations: personalized,
      isPersonalized: true,
    };
  }

  return {
    recommendations: await getColdStartRecommendations(type),
    isPersonalized: false,
  };
}

export async function HomeMovieRecommendationsSection({
  userId,
}: HomeSectionProps) {
  const { recommendations, isPersonalized } = await getHomeRecommendations(
    userId,
    'movie'
  );

  return (
    <RecommendationSection
      recommendations={recommendations}
      title={
        isPersonalized
          ? 'Picked for you'
          : 'Popular movies while we learn your taste'
      }
      description={
        isPersonalized
          ? "Based on the movies you've rated and collected."
          : "Rate a few movies and we'll start tailoring your movie recommendations."
      }
    />
  );
}

export async function HomeTvRecommendationsSection({
  userId,
}: HomeSectionProps) {
  const { recommendations, isPersonalized } = await getHomeRecommendations(
    userId,
    'tv'
  );

  return (
    <RecommendationSection
      recommendations={recommendations}
      title={
        isPersonalized
          ? 'TV picks for you'
          : 'Popular series while we learn your taste'
      }
      description={
        isPersonalized
          ? "Based on the TV series you've rated and collected."
          : "Rate a few TV series and we'll start tailoring your series recommendations."
      }
    />
  );
}
