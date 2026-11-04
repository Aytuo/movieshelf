'use client';

import {
  MARKETING_DEMO_DECADES,
  MARKETING_DEMO_GENRES,
  MARKETING_DEMO_RATING_DISTRIBUTION,
  MARKETING_DEMO_STATS,
} from '@/constants';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Star } from 'lucide-react';
import { useRef } from 'react';
import {
  createMarketingIntroTimeline,
  createMarketingScrollTimeline,
  withMarketingMotion,
} from './marketing-motion';

const maxRatingCount = Math.max(
  ...MARKETING_DEMO_RATING_DISTRIBUTION.map((item) => item.count),
  1
);

const YourTasteSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const watched = MARKETING_DEMO_STATS.watched;
  const rated = MARKETING_DEMO_STATS.rated;
  const favorites = MARKETING_DEMO_STATS.favorites;
  const averageRating = MARKETING_DEMO_STATS.averageRating.toFixed(1);
  const tasteProgress = Math.min(watched / 50, 1);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      return withMarketingMotion(section, (root) => {
        const copy = root.querySelector<HTMLElement>('.taste-copy');
        const eyebrow = root.querySelector<HTMLElement>('.taste-eyebrow');
        const title = root.querySelector<HTMLElement>('.taste-title');
        const description =
          root.querySelector<HTMLElement>('.taste-description');
        const overview = root.querySelector<HTMLElement>('.taste-overview');
        const stats = root.querySelectorAll<HTMLElement>('.taste-stat');
        const profile = root.querySelector<HTMLElement>('.taste-profile');
        const profileFill = root.querySelector<HTMLElement>(
          '.taste-profile-fill'
        );
        const breakdowns =
          root.querySelectorAll<HTMLElement>('.taste-breakdown');
        const distribution = root.querySelector<HTMLElement>(
          '.taste-distribution'
        );
        const horizontalBars =
          root.querySelectorAll<HTMLElement>('.taste-bar-fill');
        const ratingBars =
          root.querySelectorAll<HTMLElement>('.taste-rating-bar');

        const isDesktop = () =>
          window.matchMedia('(min-width: 1024px)').matches;

        // 1. Editorial introduction.
        if (copy && eyebrow && title && description) {
          createMarketingIntroTimeline({
            trigger: copy,
            eyebrow,
            title,
            description,
            start: 'top 88%',
            end: 'top 42%',
            scrub: true,
          });
        }

        // 2. Analytics content.
        if (!overview) return;

        gsap.set(stats, {
          opacity: 0,
          y: 20,
        });

        if (profile) {
          gsap.set(profile, {
            opacity: 0,
            y: 22,
          });
        }

        if (profileFill) {
          gsap.set(profileFill, {
            scaleX: 0,
          });
        }

        gsap.set(breakdowns, {
          opacity: 0,
          y: 20,
        });

        if (distribution) {
          gsap.set(distribution, {
            opacity: 0,
            y: 20,
          });
        }

        gsap.set(horizontalBars, {
          scaleX: 0,
        });

        gsap.set(ratingBars, {
          scaleY: 0,
        });

        const analyticsTimeline = createMarketingScrollTimeline(overview, {
          // The desktop charts are aligned vertically with the copy.
          // They should begin only after the introduction has progressed.
          // On mobile, they enter naturally below the text.
          start: () => (isDesktop() ? 'top 8%' : 'top 88%'),
          end: () => (isDesktop() ? 'bottom 15%' : 'bottom 20%'),
          scrub: 0.8,
        });

        // Overview statistics.
        analyticsTimeline.to(stats, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.14,
        });

        // Taste profile.
        if (profile) {
          analyticsTimeline.to(
            profile,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
            },
            1.25
          );
        }

        if (profileFill) {
          analyticsTimeline.to(
            profileFill,
            {
              scaleX: 1,
              duration: 1.1,
            },
            1.7
          );
        }

        // Genres and decades.
        analyticsTimeline.to(
          breakdowns,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.18,
          },
          2.05
        );

        // Horizontal bars.
        analyticsTimeline.to(
          horizontalBars,
          {
            scaleX: 1,
            duration: 0.9,
            stagger: 0.08,
          },
          2.7
        );

        // Rating distribution.
        if (distribution) {
          analyticsTimeline.to(
            distribution,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
            },
            3.45
          );
        }

        // Vertical rating bars.
        analyticsTimeline.to(
          ratingBars,
          {
            scaleY: 1,
            duration: 0.95,
            stagger: 0.07,
          },
          3.9
        );
      });
    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section
      ref={sectionRef}
      id="taste"
      className="border-b border-border/60 bg-surface/20"
    >
      <div className="container-content py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Editorial copy */}
          <div className="taste-copy">
            <p className="taste-eyebrow eyebrow">Your taste</p>

            <h2 className="taste-title mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Your taste,
              <br />
              <span className="text-gradient-primary">visualized.</span>
            </h2>

            <p className="taste-description mt-6 max-w-md text-sm leading-6 text-muted-foreground">
              Your ratings reveal more with every title. MovieShelf brings your
              movies and TV shows together to visualize the genres, eras and
              stories that shape your taste.
            </p>
          </div>

          {/* Taste overview */}
          <div className="taste-overview min-w-0 space-y-4">
            {/* Overview stats */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="taste-stat rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Watched</p>
                <p className="mt-3 font-heading text-2xl font-bold tracking-tight">
                  {watched}
                </p>
              </div>

              <div className="taste-stat rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Rated</p>
                <p className="mt-3 font-heading text-2xl font-bold tracking-tight">
                  {rated}
                </p>
              </div>

              <div className="taste-stat rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Favorites</p>
                <p className="mt-3 font-heading text-2xl font-bold tracking-tight">
                  {favorites}
                </p>
              </div>

              <div className="taste-stat rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Average</p>
                <div className="mt-3 flex items-center gap-1.5 font-heading text-2xl font-bold tracking-tight">
                  <Star className="size-3.5 fill-current text-rating" />
                  <span>{averageRating}</span>
                </div>
              </div>
            </section>

            {/* Taste profile */}
            <section className="taste-profile rounded-2xl p-5 surface sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Taste profile</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your taste is becoming very distinctive.
                  </p>
                </div>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {watched} titles
                </span>
              </div>

              <div className="mt-5 h-[6px] overflow-hidden rounded-full bg-surface-hover">
                <div
                  className="taste-profile-fill h-full origin-left rounded-full bg-primary"
                  style={{ width: `${tasteProgress * 100}%` }}
                />
              </div>
            </section>

            {/* Genres and decades */}
            <section className="grid gap-4 lg:grid-cols-2">
              <div className="taste-breakdown min-w-0 rounded-2xl p-5 surface sm:p-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  Top genres
                </p>

                <div className="mt-6 space-y-4">
                  {MARKETING_DEMO_GENRES.map(([genre, percentage]) => (
                    <div key={genre}>
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium">{genre}</span>
                        <span className="text-muted-foreground">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-[6px] overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className="taste-bar-fill h-full origin-left rounded-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="taste-breakdown min-w-0 rounded-2xl p-5 surface sm:p-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  Favorite decades
                </p>

                <div className="mt-6 space-y-4">
                  {MARKETING_DEMO_DECADES.map(([decade, percentage]) => (
                    <div key={decade}>
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium">{decade}</span>
                        <span className="text-muted-foreground">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-[6px] overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className="taste-bar-fill h-full origin-left rounded-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Rating distribution */}
            <section className="taste-distribution rounded-2xl p-5 surface sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase">
                    Rating distribution
                  </p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    How you rate the titles you watch.
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground tabular-nums">
                  {rated} ratings
                </span>
              </div>

              <div className="mt-6 flex h-36 items-stretch gap-1 sm:h-44 sm:gap-2">
                {MARKETING_DEMO_RATING_DISTRIBUTION.map((item) => {
                  const barHeight = (item.count / maxRatingCount) * 78;

                  return (
                    <div
                      key={item.rating}
                      className="flex min-w-0 flex-1 flex-col"
                    >
                      <div className="group relative min-h-0 flex-1">
                        <span
                          className="absolute z-10 -translate-x-1/2 text-[9px] leading-none text-muted-foreground tabular-nums sm:text-[10px]"
                          style={{
                            left: '50%',
                            bottom:
                              item.count > 0
                                ? `calc(${barHeight}% + 6px)`
                                : '7px',
                          }}
                        >
                          {item.count}
                        </span>

                        <div
                          className={`taste-rating-bar absolute inset-x-0 bottom-0 origin-bottom rounded-t-md ${
                            item.count > 0 ? 'bg-primary/70' : 'bg-border'
                          }`}
                          style={{
                            height: item.count > 0 ? `${barHeight}%` : '1px',
                          }}
                        />
                      </div>

                      <span className="mt-2 text-center text-[9px] text-muted-foreground tabular-nums sm:text-[10px]">
                        {item.rating}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourTasteSection;
