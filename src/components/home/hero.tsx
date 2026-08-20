import { ArrowRight, Bookmark, Check, Star } from 'lucide-react';
import Link from 'next/link';

const featuredMovies = [
  {
    title: 'Interstellar',
    year: 2014,
    rating: '8.7',
    image: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    className:
      'left-0 top-16 hidden rotate-[-10deg] sm:block lg:left-8 lg:top-20',
  },
  {
    title: 'Dune: Part Two',
    year: 2024,
    rating: '8.6',
    image: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    className:
      'left-1/2 top-4 z-20 -translate-x-1/2 rotate-[1deg] sm:top-0 lg:top-4',
  },
  {
    title: 'The Godfather',
    year: 1972,
    rating: '9.2',
    image: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    className:
      'right-0 top-20 hidden rotate-[9deg] sm:block lg:right-8 lg:top-24',
  },
];

const Hero = () => {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/40">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-25%] left-1/2 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute bottom-[-30%] left-[-10%] h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_72%)]" />
      </div>

      <div className="container-content">
        <div className="grid min-h-[calc(100vh-var(--header-height))] items-center gap-16 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-20">
          {/* Content */}
          <div className="relative z-30 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-muted px-3 py-1.5 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              Your personal movie shelf
            </div>

            <h1 className="text-5xl font-bold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Your movies.
              <br />
              <span className="text-gradient-brand">Your taste.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Discover movies worth remembering, build your personal collection
              and keep track of the films that shaped your taste.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/discover"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_var(--primary-glow)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_12px_40px_var(--primary-glow)]"
              >
                Explore movies
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/shelf"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover"
              >
                <Bookmark className="size-4" />
                My shelf
              </Link>
            </div>

            {/* Small product statement */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Check className="size-3.5 text-primary" />
                Track what you&apos;ve seen
              </span>

              <span className="inline-flex items-center gap-2">
                <Star className="size-3.5 text-rating" />
                Rate your favorites
              </span>

              <span className="inline-flex items-center gap-2">
                <Bookmark className="size-3.5 text-primary" />
                Build your collection
              </span>
            </div>
          </div>

          {/* Poster composition */}
          <div className="relative mx-auto h-125 w-full max-w-140 sm:h-140">
            {/* Glow behind posters */}
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />

            {featuredMovies.map((movie) => (
              <div
                key={movie.title}
                className={`absolute w-45 poster-frame transition-transform duration-500 hover:z-40 hover:scale-[1.03] sm:w-52.5 lg:w-57.5 ${movie.className}`}
              >
                <div className="relative aspect-2/3">
                  <img
                    src={movie.image}
                    alt={`${movie.title} poster`}
                    className="h-full w-full object-cover"
                  />

                  <div className="poster-overlay" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-sm font-semibold text-white">
                      {movie.title}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-white/65">
                      <span>{movie.year}</span>

                      <span className="size-0.5 rounded-full bg-white/40" />

                      <span className="inline-flex items-center gap-1 text-rating">
                        <Star className="size-3 fill-current" />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Floating shelf card */}
            <div className="absolute right-2 bottom-2 z-30 hidden w-48 rounded-xl p-4 shadow-2xl glass sm:block lg:right-0">
              <div className="text-xs font-medium text-muted-foreground">
                Your shelf
              </div>

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold tracking-tight">128</div>

                  <div className="text-xs text-muted-foreground">
                    movies collected
                  </div>
                </div>

                <div className="flex -space-x-2">
                  {featuredMovies.map((movie) => (
                    <img
                      key={movie.title}
                      src={movie.image}
                      alt=""
                      className="size-7 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
