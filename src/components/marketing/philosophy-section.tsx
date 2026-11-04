'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Bookmark, Film, Star } from 'lucide-react';
import { useRef } from 'react';
import {
  createMarketingIntroTimeline,
  createMarketingScrollTimeline,
  withMarketingMotion,
} from './marketing-motion';

const pillars = [
  {
    icon: Film,
    eyebrow: '01 · Discover',
    title: 'Go beyond the obvious.',
    description:
      'Explore movies, TV shows, directors, actors, genres or stories that deserve your attention and place in your movie world.',
  },
  {
    icon: Bookmark,
    eyebrow: '02 · Collect',
    title: "Build something that's yours.",
    description:
      "Keep a personal shelf of movies and TV shows you've seen, want to watch or never want to forget.",
  },
  {
    icon: Star,
    eyebrow: '03 · Remember',
    title: 'Make your taste visible.',
    description:
      'Rate movies and TV shows, save favorites and turn years of watching into something you can actually see.',
  },
];

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      return withMarketingMotion(section, (root) => {
        const copy = root.querySelector<HTMLElement>('.philosophy-copy');
        const eyebrow = root.querySelector<HTMLElement>('.philosophy-eyebrow');
        const titleLines = root.querySelectorAll<HTMLElement>(
          '.philosophy-title-line'
        );
        const description = root.querySelector<HTMLElement>(
          '.philosophy-description'
        );
        const pillarsContainer = root.querySelector<HTMLElement>(
          '.philosophy-pillars'
        );
        const pillars =
          root.querySelectorAll<HTMLElement>('.philosophy-pillar');

        // 1. Editorial introduction.
        if (copy && eyebrow && description && titleLines.length > 0) {
          createMarketingIntroTimeline({
            trigger: copy,
            eyebrow,
            titleLines,
            description,
            start: 'top 88%',
            end: 'top 42%',
            scrub: true,
          });
        }

        // 2. Content reveal.
        // Desktop: starts exactly after the introduction.
        // Mobile: starts when the cards naturally enter the viewport.
        const isDesktop = () =>
          window.matchMedia('(min-width: 1024px)').matches;

        if (pillarsContainer && pillars.length > 0) {
          gsap.set(pillars, {
            opacity: 0,
            y: 28,
          });

          const pillarsTimeline = createMarketingScrollTimeline(
            pillarsContainer,
            {
              start: () => (isDesktop() ? 'top 42%' : 'top 88%'),
              end: () => (isDesktop() ? 'top -18%' : 'bottom 25%'),
              scrub: true,
            }
          );

          pillarsTimeline.to(pillars, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.16,
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
      id="why"
      className="relative overflow-hidden border-y border-border/60 bg-surface/30"
    >
      <div className="container-content py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="philosophy-copy relative">
            <div className="philosophy-heading">
              <p className="philosophy-eyebrow eyebrow">The MovieShelf idea</p>

              <h2 className="mt-5 max-w-lg font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="philosophy-title-line block">
                    Some stories
                  </span>
                </span>

                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="philosophy-title-line block">
                    entertain you.
                  </span>
                </span>

                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="philosophy-title-line block text-gradient-primary">
                    Others stay
                  </span>
                </span>

                <span className="block overflow-hidden pb-[0.08em]">
                  <span className="philosophy-title-line block text-gradient-primary">
                    with you.
                  </span>
                </span>
              </h2>
            </div>

            <p className="philosophy-description mt-6 max-w-md text-sm leading-6 text-muted-foreground">
              MovieShelf gives the movies and TV shows that matter to you a
              place to live — not just in your watch history, but in a
              collection that reflects who you are.
            </p>
          </div>

          <div className="philosophy-pillars grid gap-8 sm:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.eyebrow} className="philosophy-pillar">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary-muted text-primary">
                    <Icon className="size-4" />
                  </div>

                  <p className="mt-6 text-[10px] font-semibold tracking-[0.18em] text-primary uppercase">
                    {pillar.eyebrow}
                  </p>

                  <h3 className="mt-3 font-heading text-lg font-semibold">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {pillar.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
