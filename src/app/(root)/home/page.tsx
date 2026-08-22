import Hero from '@/components/home/hero';
import MovieGrid from '@/components/movies/movie-grid';
import {
  MOCK_RECENTLY_ADDED_MOVIES,
  MOCK_RECOMMENDED_MOVIES,
} from '@/constants';

export default function HomePage() {
  const featuredMovies = MOCK_RECOMMENDED_MOVIES;
  const recentlyAdded = MOCK_RECENTLY_ADDED_MOVIES;

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

        <section className="container-content py-12 lg:py-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                Recommended for you
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                A few movies worth discovering.
              </p>
            </div>
          </div>

          <MovieGrid movies={featuredMovies} />
        </section>

        <section className="container-content pb-16 lg:pb-24">
          <div className="mb-7">
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Recently added
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Movies waiting to find their place on your shelf.
            </p>
          </div>

          <MovieGrid movies={recentlyAdded} />
        </section>
      </div>
    </>
  );
}
