import Hero from '@/components/home/hero';
import RecommendationSection from '@/components/recommendations/recommendation-section';
import { requireSession } from '@/lib/auth/require-session';
import { getColdStartRecommendations } from '@/lib/recommendations/cold-start';
import { getProfileByUserId } from '@/lib/repositories/profile-repository';
import { getRecommendationsForUser } from '@/lib/services/recommendation-service';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await requireSession();

  const profile = await getProfileByUserId(session.user.id);

  if (profile && !profile.onboardingCompleted) {
    redirect('/onboarding');
  }

  const personalized = await getRecommendationsForUser(session.user.id);

  const recommendations =
    personalized.length > 0
      ? personalized
      : await getColdStartRecommendations();

  const isPersonalized = personalized.length > 0;

  return (
    <>
      <Hero />

      <div>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,80,50,0.10),transparent_40%)]" />

          <div className="relative container-content py-16 lg:py-20">
            <p className="text-sm font-medium text-primary">Welcome back</p>

            <h1 className="mt-3 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Ready to find your next favorite?
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Explore movies, keep your shelf organized and continue building
              your personal movie taste.
            </p>
          </div>
        </section>

        <RecommendationSection
          recommendations={recommendations}
          title={
            isPersonalized
              ? 'Picked for you'
              : 'Popular while we learn your taste'
          }
          description={
            isPersonalized
              ? "Based on the movies you've rated and collected."
              : "Rate a few movies and we'll start tailoring this space to you."
          }
        />
      </div>
    </>
  );
}
