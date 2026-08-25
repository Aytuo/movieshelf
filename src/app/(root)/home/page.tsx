import Hero from '@/components/home/hero';
import MovieCarousel from '@/components/home/movie-carousel';
import RankedMovieList from '@/components/home/ranked-movie-list';
import TastePreview from '@/components/profile/taste-preview';
import RecommendationSection from '@/components/recommendations/recommendation-section';
import { requireSession } from '@/lib/auth/require-session';
import { getColdStartRecommendations } from '@/lib/recommendations/cold-start';
import { getProfileByUserId } from '@/lib/repositories/profile-repository';
import { getHomeMovieSections } from '@/lib/services/home-service';
import { getRecommendationsForUser } from '@/lib/services/recommendation-service';
import { getTasteProfile } from '@/lib/services/taste-service';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await requireSession();

  const profile = await getProfileByUserId(session.user.id);

  if (profile && !profile.onboardingCompleted) {
    redirect('/onboarding');
  }

  const [personalized, taste, sections] = await Promise.all([
    getRecommendationsForUser(session.user.id),
    getTasteProfile(session.user.id),
    getHomeMovieSections(),
  ]);

  const recommendations =
    personalized.length > 0
      ? personalized
      : await getColdStartRecommendations();

  const isPersonalized = personalized.length > 0;

  const topTen = sections.trending.slice(0, 10);

  return (
    <>
      <Hero />

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
              username={profile?.username ?? session.user.name}
            />
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

        <MovieCarousel
          eyebrow="Handpicked Selections"
          title="Recommended by TMDB"
          description="Popular picks and highly rated films curated by TMDB's global community."
          movies={sections.recommended.slice(0, 20)}
          href="/discover?sort=popularity"
        />

        <MovieCarousel
          eyebrow="In the spotlight"
          title="Trending this week"
          description="The movies gaining the most momentum across TMDB right now."
          movies={sections.trending.slice(0, 20)}
          href="/discover?sort=popularity"
        />

        <MovieCarousel
          eyebrow="Critics' shelf"
          title="Top picks"
          description="Highly rated movies with enough votes to make the signal meaningful."
          movies={sections.topPicks}
          href="/discover?sort=rating"
        />

        <MovieCarousel
          eyebrow="Currently in cinemas"
          title="Now Playing"
          description="Movies currently making their way through cinemas."
          movies={sections.nowPlaying}
          href="/discover"
        />

        <MovieCarousel
          eyebrow="Coming soon"
          title="Upcoming"
          description="Movies arriving soon that might deserve a place on your shelf."
          movies={sections.upcoming}
          href="/discover"
        />

        <RankedMovieList movies={topTen} />

        <MovieCarousel
          eyebrow="Audience Favorites"
          title="Popular right now"
          description="A broader look at the movies attracting attention across TMDB."
          movies={sections.popular.slice(0, 20)}
          href="/discover?sort=popularity"
        />

        <MovieCarousel
          eyebrow="Hall of Fame"
          title="Top Rated"
          description="Some of the most acclaimed movies ever made."
          movies={sections.topRated.slice(0, 20)}
          href="/discover?sort=popularity"
        />
      </main>
    </>
  );
}
