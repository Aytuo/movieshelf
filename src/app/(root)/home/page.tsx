import Hero from '@/components/home/hero';
import RecommendationSection from '@/components/recommendations/recommendation-section';
import TastePreview from '@/components/taste/taste-preview';
import { requireSession } from '@/lib/auth/require-session';
import { getColdStartRecommendations } from '@/lib/recommendations/cold-start';
import { getProfileByUserId } from '@/lib/repositories';
import { getRecommendationsForUser } from '@/lib/services/recommendation-service';
import { getTasteProfile } from '@/lib/services/taste-service';
import Link from 'next/link';

export default async function HomePage() {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);

  const [personalizedMovies, personalizedTv, taste] = await Promise.all([
    getRecommendationsForUser(session.user.id, 'movie'),
    getRecommendationsForUser(session.user.id, 'tv'),
    getTasteProfile(session.user.id),
  ]);

  // Cold start remains a fallback only; Movies and TV are handled independently so that having enough movie signals does not affect TV recommendations, and vice versa.

  const movieRecommendations =
    personalizedMovies.length > 0
      ? personalizedMovies
      : await getColdStartRecommendations('movie');

  const tvRecommendations =
    personalizedTv.length > 0
      ? personalizedTv
      : await getColdStartRecommendations('tv');

  const hasMovieRecommendations = personalizedMovies.length > 0;
  const hasTvRecommendations = personalizedTv.length > 0;

  return (
    <>
      <Hero />

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

      <main>
        <section className="border-b border-border/60">
          <div className="container-content py-14 lg:py-16">
            <div className="mb-7">
              <p className="eyebrow">Your taste</p>

              <h1 className="mt-2 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Your shelf is becoming your cinematic identity.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                See what your ratings say about you, then discover what might
                belong on your shelf next.
              </p>
            </div>

            <TastePreview
              taste={taste}
              username={profile?.username ?? session.user.name ?? 'profile'}
            />
          </div>
        </section>

        <RecommendationSection
          recommendations={movieRecommendations}
          title={
            hasMovieRecommendations
              ? 'Picked for you'
              : 'Popular movies while we learn your taste'
          }
          description={
            hasMovieRecommendations
              ? "Based on the movies you've rated and collected."
              : "Rate a few movies and we'll start tailoring your movie recommendations."
          }
        />

        <RecommendationSection
          recommendations={tvRecommendations}
          title={
            hasTvRecommendations
              ? 'TV picks for you'
              : 'Popular series while we learn your taste'
          }
          description={
            hasTvRecommendations
              ? "Based on the TV series you've rated and collected."
              : "Rate a few TV series and we'll start tailoring your series recommendations."
          }
        />
      </main>
    </>
  );
}
