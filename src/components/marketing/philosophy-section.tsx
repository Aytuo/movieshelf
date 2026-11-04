'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Bookmark, Film, Star } from 'lucide-react';
import { useRef } from 'react';
import { withMarketingMotion } from './marketing-motion';

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
        const eyebrow = root.querySelector('.philosophy-eyebrow');
        const titleLines = root.querySelectorAll('.philosophy-title-line');
        const description = root.querySelector('.philosophy-description');
        const pillars = root.querySelectorAll('.philosophy-pillar');

        const timeline = gsap.timeline({
          defaults: {
            ease: 'none',
          },
          scrollTrigger: {
            trigger: root,
            start: 'top 88%',
            end: 'bottom 25%',
            scrub: 0.8,
          },
        });

        timeline
          .fromTo(
            eyebrow,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.7 }
          )
          .fromTo(
            titleLines,
            { autoAlpha: 0, y: 38 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.8,
              stagger: 0.18,
            },
            0.35
          )
          .fromTo(
            description,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            1.35
          )
          .fromTo(
            pillars,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              stagger: 0.35,
            },
            1.8
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
      id="why"
      className="relative overflow-hidden border-y border-border/60 bg-surface/30"
    >
      <div className="container-content py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="philosophy-copy relative">
            <p className="philosophy-eyebrow eyebrow">The MovieShelf idea</p>

            <h2 className="mt-5 max-w-lg font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              <span className="philosophy-title-line block">Some stories</span>

              <span className="philosophy-title-line block">
                entertain you.
              </span>

              <span className="philosophy-title-line block text-gradient-primary">
                Others stay
              </span>

              <span className="philosophy-title-line block text-gradient-primary">
                with you.
              </span>
            </h2>

            <p className="philosophy-description mt-6 max-w-md text-sm leading-6 text-muted-foreground">
              MovieShelf gives the movies and TV shows that matter to you a
              place to live — not just in your watch history, but in a
              collection that reflects who you are.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
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
