'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bookmark, Film, Star } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: Film,
    eyebrow: '01 · Discover',
    title: 'Go beyond the obvious.',
    description:
      'Explore films, directors, genres and stories that deserve a place in your movie world.',
  },
  {
    icon: Bookmark,
    eyebrow: '02 · Collect',
    title: "Build something that's yours.",
    description:
      "Keep a personal shelf of films you've seen, want to see or never want to forget.",
  },
  {
    icon: Star,
    eyebrow: '03 · Remember',
    title: 'Make your taste visible.',
    description:
      'Rate movies, save favorites and turn years of watching into something you can actually see.',
  },
];

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const titleLines = gsap.utils.toArray<HTMLElement>(
        '.philosophy-title-line'
      );

      const pillars = gsap.utils.toArray<HTMLElement>('.philosophy-pillar');

      const eyebrow = sectionRef.current?.querySelector('.philosophy-eyebrow');

      const description = sectionRef.current?.querySelector(
        '.philosophy-description'
      );

      if (!eyebrow || !description) {
        return;
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 35%',
          scrub: 1,
        },
      });

      timeline
        .fromTo(
          eyebrow,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          }
        )
        .fromTo(
          titleLines,
          {
            opacity: 0,
            y: 70,
            rotateX: -18,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.18,
            duration: 1,
          },
          '-=0.35'
        )
        .fromTo(
          description,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          '-=0.55'
        )
        .fromTo(
          pillars,
          {
            opacity: 0,
            y: 70,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.18,
            duration: 0.8,
          },
          '-=0.35'
        );
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
          <div className="relative" style={{ perspective: '1000px' }}>
            <p className="philosophy-eyebrow eyebrow">The MovieShelf idea</p>

            <h2 className="mt-5 max-w-lg font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              <span className="philosophy-title-line block">Some films</span>

              <span className="philosophy-title-line block">you watch.</span>

              <span className="philosophy-title-line block text-gradient-primary">
                Some films stay
              </span>

              <span className="philosophy-title-line block text-gradient-primary">
                with you.
              </span>
            </h2>

            <p className="philosophy-description mt-6 max-w-md text-sm leading-6 text-muted-foreground">
              MovieShelf gives the films that matter to you a place to live —
              not just in your watch history, but in a collection that reflects
              who you are.
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
