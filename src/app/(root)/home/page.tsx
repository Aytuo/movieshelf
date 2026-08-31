import Hero from '@/components/home/hero';
import MediaCarousel from '@/components/media/media-carousel';
import RankedMediaList from '@/components/media/ranked-media-list';
import TastePreview from '@/components/profile/taste-preview';
import RecommendationSection from '@/components/recommendations/recommendation-section';
import { requireSession } from '@/lib/auth/require-session';
import { getColdStartRecommendations } from '@/lib/recommendations/cold-start';
import { getProfileByUserId } from '@/lib/repositories';
import { getHomeSections } from '@/lib/services/home-service';
import { getRecommendationsForUser } from '@/lib/services/recommendation-service';
import { getTasteProfile } from '@/lib/services/taste-service';

export default async function HomePage() {
  const session = await requireSession();

  const profile = await getProfileByUserId(session.user.id);

  // TODO: Add CTA to complete onboarding
  // if (profile && !profile.onboardingCompleted) {
  //   redirect('/onboarding');
  // }

  const [personalizedMovies, personalizedTv, taste, sections] =
    await Promise.all([
      getRecommendationsForUser(session.user.id, 'movie'),
      getRecommendationsForUser(session.user.id, 'tv'),
      getTasteProfile(session.user.id),
      getHomeSections(),
    ]);

  // Cold start remains a fallback only: Movies and TV should be handled independently so that having enough movie signals does not affect TV recommendations, and vice versa.

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

      <main>
        {/* ---------------------------------------------------------------- */}
        {/* Taste                                                            */}
        {/* ---------------------------------------------------------------- */}

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

        {/* ---------------------------------------------------------------- */}
        {/* Personalized movies                                             */}
        {/* ---------------------------------------------------------------- */}

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

        {/* ---------------------------------------------------------------- */}
        {/* Personalized TV                                                 */}
        {/* ---------------------------------------------------------------- */}

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

        {/* ---------------------------------------------------------------- */}
        {/* Movie discovery                                                  */}
        {/* ---------------------------------------------------------------- */}

        <MediaCarousel
          eyebrow="Audience favorites"
          title="Popular Movies"
          description="A broader look at the movies attracting attention across TMDB."
          media={sections.movies.popular.slice(0, 20)}
          href="/discover?type=movie&sort=popularity"
        />

        <MediaCarousel
          eyebrow="In the spotlight"
          title="Trending Movies"
          description="The movies gaining the most momentum across TMDB right now."
          media={sections.movies.trending.slice(0, 20)}
          href="/discover?type=movie&sort=popularity"
        />

        <MediaCarousel
          eyebrow="Currently in cinemas"
          title="Now Playing"
          description="Movies currently making their way through cinemas."
          media={sections.movies.nowPlaying.slice(0, 20)}
          href="/discover?type=movie"
        />

        <MediaCarousel
          eyebrow="Coming soon"
          title="Upcoming Movies"
          description="Movies arriving soon that might deserve a place on your shelf."
          media={sections.movies.upcoming.slice(0, 20)}
          href="/discover?type=movie"
        />

        <MediaCarousel
          eyebrow="Hall of Fame"
          title="Top Rated Movies"
          description="Some of the most acclaimed movies in the TMDB catalog."
          media={sections.movies.topRated.slice(0, 20)}
          href="/discover?type=movie&sort=rating"
        />

        {/* ---------------------------------------------------------------- */}
        {/* TV discovery                                                     */}
        {/* ---------------------------------------------------------------- */}

        <MediaCarousel
          eyebrow="Audience favorites"
          title="Popular TV"
          description="A broader look at the series attracting attention across TMDB."
          media={sections.tv.popular.slice(0, 20)}
          href="/discover?type=tv&sort=popularity"
        />

        <MediaCarousel
          eyebrow="In the spotlight"
          title="Trending TV"
          description="The TV series gaining the most momentum across TMDB right now."
          media={sections.tv.trending.slice(0, 20)}
          href="/discover?type=tv&sort=popularity"
        />

        <MediaCarousel
          eyebrow="On air today"
          title="Airing Today"
          description="Series with new episodes airing today."
          media={sections.tv.airingToday.slice(0, 20)}
          href="/discover?type=tv"
        />

        <MediaCarousel
          eyebrow="Currently on air"
          title="On the Air"
          description="Series currently airing and worth keeping an eye on."
          media={sections.tv.onTheAir.slice(0, 20)}
          href="/discover?type=tv"
        />

        <MediaCarousel
          eyebrow="Hall of Fame"
          title="Top Rated TV"
          description="Some of the most acclaimed TV series in the TMDB catalog."
          media={sections.tv.topRated.slice(0, 20)}
          href="/discover?type=tv&sort=rating"
        />

        {/* ---------------------------------------------------------------- */}
        {/* Global weekly chart                                              */}
        {/* ---------------------------------------------------------------- */}

        <RankedMediaList media={sections.movies.topPicks} />
      </main>
    </>
  );
}
