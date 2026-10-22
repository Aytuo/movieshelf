import { UserHomeSummary } from '@/lib/services/media-interaction-service';
import { ArrowRight, Bookmark, Check, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// const featuredMovies = [
//   {
//     title: 'Interstellar',
//     year: 2014,
//     rating: '8.7',
//     image: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
//     className:
//       'left-0 top-16 hidden rotate-[-10deg] sm:block lg:left-8 lg:top-20',
//   },
//   {
//     title: 'Dune: Part Two',
//     year: 2024,
//     rating: '8.6',
//     image: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
//     className:
//       'left-1/2 top-4 z-20 -translate-x-1/2 rotate-[1deg] sm:top-0 lg:top-4',
//   },
//   {
//     title: 'The Godfather',
//     year: 1972,
//     rating: '9.2',
//     image: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
//     className:
//       'right-0 top-20 hidden rotate-[9deg] sm:block lg:right-8 lg:top-24',
//   },
// ];

const centerPosterClass =
  'left-1/2 top-4 z-20 -translate-x-1/2 rotate-[1deg] sm:top-0 lg:top-4';

const leftPosterClass =
  'left-0 top-16 hidden rotate-[-10deg] sm:block lg:left-8 lg:top-20';

const rightPosterClass =
  'right-0 top-20 hidden rotate-[9deg] sm:block lg:right-8 lg:top-24';

function getPosterClassName(index: number, total: number) {
  if (total <= 2) {
    return index === 0 ? centerPosterClass : rightPosterClass;
  }

  if (index === 0) return centerPosterClass;
  if (index === 1) return leftPosterClass;

  return rightPosterClass;
}

function getTmdbPosterUrl(posterPath: string) {
  return `https://image.tmdb.org/t/p/w780${posterPath}`;
}

type HeroProps = {
  summary: UserHomeSummary;
};

const Hero = ({ summary }: HeroProps) => {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/40">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-25%] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

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

            {summary.latestRated.length > 0 ? (
              summary.latestRated.map((item, index) => {
                const posterUrl = item.posterPath
                  ? getTmdbPosterUrl(item.posterPath)
                  : null;

                const year = item.releaseDate?.slice(0, 4);

                return (
                  <div
                    key={`${item.type}-${item.tmdbId}`}
                    className={`absolute w-45 poster-frame transition-transform duration-500 hover:z-40 hover:scale-[1.03] sm:w-[210px] lg:w-[230px] ${getPosterClassName(index, summary.latestRated.length)}`}
                  >
                    <div className="relative aspect-[2/3]">
                      {posterUrl ? (
                        <>
                          <Image
                            src={posterUrl}
                            alt={`${item.title} poster`}
                            fill
                            sizes="(max-width: 640px) 80vw, 230px"
                            className="object-cover"
                          />
                          <div className="poster-overlay" />
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center bg-surface-hover">
                            <Bookmark className="size-9 text-muted-foreground/60" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
                        </>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="text-sm leading-snug font-semibold text-white">
                          {item.title}
                          {year && (
                            <span className="ml-1 font-medium text-white/65">
                              ({year})
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          {item.tmdbRating !== null && (
                            <span className="inline-flex items-center gap-1.5 text-white/65">
                              <Star className="size-3" />
                              <span>TMDB {item.tmdbRating.toFixed(1)}</span>
                            </span>
                          )}

                          {item.userRating !== null && (
                            <span className="inline-flex items-center gap-1.5">
                              <Star className="size-3 fill-current text-rating" />
                              <span className="font-semibold text-rating">
                                {item.userRating}/10
                              </span>
                              <span className="text-white/65">You</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="absolute top-1/2 left-1/2 z-20 w-full max-w-xs -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border/60 bg-surface/80 p-6 text-center shadow-xl backdrop-blur-xl">
                <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-primary-muted text-primary">
                  <Bookmark className="size-5" />
                </div>

                <h2 className="mt-4 font-semibold">
                  {summary.shelfCount === 0
                    ? 'Start building your shelf'
                    : 'Your ratings will appear here'}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {summary.shelfCount === 0
                    ? 'Add movies and TV series to your collection and make this space yours.'
                    : 'Rate a movie or TV series to see your latest picks featured here.'}
                </p>

                <Link
                  href="/discover"
                  className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Discover titles
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}

            {/* Floating shelf card */}
            {summary.shelfCount > 0 && (
              <div className="absolute right-2 bottom-2 z-30 hidden w-64 rounded-xl p-4 shadow-2xl glass-strong sm:block lg:right-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Your shelf
                    </div>

                    <div className="mt-1 text-3xl font-bold tracking-tight">
                      {summary.shelfCount}
                    </div>

                    <div className="text-xs whitespace-nowrap text-muted-foreground">
                      titles in your collection
                    </div>
                  </div>

                  <div className="flex shrink-0 -space-x-2">
                    {summary.latestRated
                      .filter((item) => item.posterPath)
                      .slice(0, 3)
                      .map((item) => (
                        <Image
                          key={`${item.type}-${item.tmdbId}`}
                          src={getTmdbPosterUrl(item.posterPath!)}
                          alt=""
                          width={32}
                          height={32}
                          className="size-8 rounded-full border-2 border-background object-cover"
                        />
                      ))}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Check className="size-3.5 text-primary" />
                      <span className="text-sm font-semibold">
                        {summary.watchedCount}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Watched
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <Star className="size-3.5 text-rating" />
                      <span className="text-sm font-semibold">
                        {summary.ratedCount}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Rated
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="size-3.5 text-rose-400" />
                      <span className="text-sm font-semibold">
                        {summary.favoritesCount}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      Favorites
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
