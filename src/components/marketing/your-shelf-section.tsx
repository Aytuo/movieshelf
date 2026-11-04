'use client';

import { MARKETING_DEMO_STATS, MARKETING_DEMO_TITLES } from '@/constants';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Film,
  Heart,
  Library,
  Menu,
  Search,
  Star,
  Tv,
  UserRound,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import {
  createMarketingIntroTimeline,
  createMarketingScrollTimeline,
  withMarketingMotion,
} from './marketing-motion';

const titles = MARKETING_DEMO_TITLES;

const YourShelfSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      return withMarketingMotion(section, (root) => {
        const copy = root.querySelector<HTMLElement>('.shelf-preview-copy');
        const eyebrow = root.querySelector<HTMLElement>(
          '.shelf-preview-eyebrow'
        );
        const title = root.querySelector<HTMLElement>('.shelf-preview-title');
        const description = root.querySelector<HTMLElement>(
          '.shelf-preview-description'
        );
        const frame = root.querySelector<HTMLElement>('.shelf-preview-frame');
        const statsContainer = root.querySelector<HTMLElement>(
          '.shelf-preview-stats'
        );
        const stats = root.querySelectorAll<HTMLElement>('.shelf-preview-stat');

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

        // 2. Statistics.
        if (statsContainer && stats.length > 0) {
          gsap.set(stats, {
            opacity: 0,
            y: 24,
          });

          const statsTimeline = createMarketingScrollTimeline(statsContainer, {
            start: () => (isDesktop() ? 'top 54%' : 'top 78%'),
            end: () => (isDesktop() ? 'top 18%' : 'bottom 28%'),
            scrub: true,
          });

          statsTimeline.to(stats, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.12,
          });
        }

        // 3. Entire application preview.
        // No animations are applied to its children.
        if (frame) {
          gsap.set(frame, {
            opacity: 0,
            y: 42,
            scale: 0.975,
          });

          const frameTimeline = createMarketingScrollTimeline(frame, {
            start: () => (isDesktop() ? 'top 18%' : 'top 88%'),
            end: () => (isDesktop() ? 'top -14%' : 'top 44%'),
            scrub: true,
          });

          frameTimeline.to(frame, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
          });
        }
      });
    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section
      ref={sectionRef}
      id="shelf"
      className="overflow-hidden border-b border-border/60"
    >
      <div className="container-content py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="shelf-preview-frame order-2 overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_30px_100px_rgb(0_0_0/35%)] lg:order-1">
            {/* App navbar */}
            <div className="relative grid h-12 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-border/60 px-3 sm:px-4 md:flex md:justify-between">
              <div className="flex min-w-0 items-center">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground md:hidden"
                >
                  <Menu className="size-3.5" />
                </span>

                <div className="hidden shrink-0 items-center gap-1.5 md:flex">
                  <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Clapperboard className="size-3.5" />
                  </span>

                  <span className="text-xs font-bold tracking-tight">
                    Movie<span className="text-primary">Shelf</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-self-center md:hidden">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Clapperboard className="size-3.5" />
                </span>

                <span className="ml-1.5 text-xs font-bold tracking-tight">
                  Movie<span className="text-primary">Shelf</span>
                </span>
              </div>

              <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-3 text-[10px] font-medium text-muted-foreground md:flex lg:gap-4">
                <span>Movies</span>
                <span>TV Series</span>
                <span>Discover</span>
                <span>Rankings</span>
              </nav>

              <div className="flex shrink-0 items-center gap-1.5 justify-self-end md:flex-1 md:justify-end">
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground"
                >
                  <Search className="size-3.5" />
                </span>

                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground"
                >
                  <Bell className="size-3.5" />
                </span>

                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-muted-foreground"
                >
                  <UserRound className="size-3.5" />
                </span>

                <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
              </div>
            </div>

            {/* Shelf page */}
            <div className="p-4 sm:p-5">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
                    Your collection
                  </p>

                  <h3 className="mt-1 font-heading text-xl font-semibold">
                    My Shelf
                  </h3>

                  <p className="mt-1 hidden max-w-md text-xs leading-5 text-muted-foreground sm:block">
                    Everything you&apos;ve decided deserves a place in your
                    personal collection.
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  Activity
                  <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Media filters */}
              <div className="mt-5">
                <p className="mb-2 text-[10px] font-medium text-muted-foreground">
                  Media
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary-muted px-2 py-1.5 text-[10px] font-medium text-primary">
                    All{' '}
                    <span className="opacity-60">
                      {MARKETING_DEMO_STATS.totalTitles}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    Movies{' '}
                    <span className="opacity-60">
                      {MARKETING_DEMO_STATS.movies}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    TV Series{' '}
                    <span className="opacity-60">
                      {MARKETING_DEMO_STATS.tvSeries}
                    </span>
                  </span>
                </div>
              </div>

              {/* Status filters */}
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-medium text-muted-foreground">
                  Status
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-muted px-2 py-1.5 text-[10px] font-medium text-primary">
                    <Library className="size-3" />
                    All{' '}
                    <span className="opacity-60">
                      {MARKETING_DEMO_STATS.totalTitles}
                    </span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Bookmark className="size-3" />
                    Watchlist
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Clock3 className="size-3" />
                    Watching
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Check className="size-3" />
                    Watched
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <X className="size-3" />
                    Dropped
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Heart className="size-3" />
                    Favorites
                  </span>
                </div>
              </div>

              {/* Media grid */}
              <div className="mt-6 grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-5">
                {titles.map((title) => (
                  <div key={title.title} className="group min-w-0">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
                      <Image
                        src={title.image}
                        alt={`${title.title} poster`}
                        fill
                        sizes="(max-width: 640px) 30vw, 120px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      <div
                        className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded bg-black/80 text-white shadow-sm"
                        title={title.type === 'Movie' ? 'Film' : 'TV'}
                      >
                        {title.type === 'Movie' ? (
                          <Film className="size-3" />
                        ) : (
                          <Tv className="size-3" />
                        )}
                      </div>

                      <div className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded bg-black/80 px-1 py-1 text-[8px] font-semibold text-white shadow-sm">
                        <Star className="size-2.5 fill-current text-rating" />
                        {title.tmdbRating}
                      </div>

                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 rounded bg-black/75 px-1.5 py-1 text-[9px] font-semibold text-rating">
                          <Star className="size-2.5 fill-current" />
                          {title.rating}
                        </span>

                        {title.favorite && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-black/75 text-rose-400">
                            <Heart className="size-3 fill-current" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 min-w-0">
                      <p className="truncate text-[10px] font-semibold transition-colors group-hover:text-primary">
                        {title.title}
                      </p>

                      <p className="mt-1 text-[9px] text-muted-foreground">
                        {title.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editorial copy */}
          <div className="shelf-preview-copy order-1 lg:order-2">
            <p className="shelf-preview-eyebrow eyebrow">Your shelf</p>

            <h2 className="shelf-preview-title mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Build a collection that feels like you.
            </h2>

            <p className="shelf-preview-description mt-6 text-base leading-7 text-muted-foreground">
              Your shelf isn&apos;t another watch queue. It&apos;s a record of
              the movies and TV shows you&apos;ve discovered, loved, rated and
              decided to keep.
            </p>

            <div className="shelf-preview-stats mt-8 grid grid-cols-2 gap-4">
              <div className="shelf-preview-stat rounded-xl p-4 surface">
                <Bookmark className="size-4 text-primary" />
                <div className="mt-4 text-2xl font-bold">
                  {MARKETING_DEMO_STATS.totalTitles}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  titles collected
                </p>
              </div>

              <div className="shelf-preview-stat rounded-xl p-4 surface">
                <Heart className="size-4 text-primary" />
                <div className="mt-4 text-2xl font-bold">
                  {MARKETING_DEMO_STATS.favorites}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">favorites</p>
              </div>

              <div className="shelf-preview-stat rounded-xl p-4 surface">
                <Star className="size-4 text-rating" />
                <div className="mt-4 text-2xl font-bold">
                  {MARKETING_DEMO_STATS.rated}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  titles rated
                </p>
              </div>

              <div className="shelf-preview-stat rounded-xl p-4 surface">
                <Star className="size-4 fill-current text-rating" />

                <div className="mt-4 text-2xl font-bold">
                  {MARKETING_DEMO_STATS.averageRating.toFixed(1)}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  average rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourShelfSection;
