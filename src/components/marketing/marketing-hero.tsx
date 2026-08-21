'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import CinematicWall from './cinematic-wall';

gsap.registerPlugin(ScrollTrigger);

const MARKETING_POSTERS = [
  {
    title: 'Interstellar',
    year: '2014',
    rating: '8.7',
    image: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    title: 'The Dark Knight',
    year: '2008',
    rating: '9.0',
    image: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    title: 'Inception',
    year: '2010',
    rating: '8.8',
    image: 'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  },
  {
    title: 'Dune: Part Two',
    year: '2024',
    rating: '8.6',
    image: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    title: 'The Godfather',
    year: '1972',
    rating: '9.2',
    image: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  },
  {
    title: 'Fight Club',
    year: '1999',
    rating: '8.8',
    image: 'https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
  },
];

const MarketingHero = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const posters = gsap.utils.toArray<HTMLElement>('.marketing-poster');
      const title = gsap.utils.toArray<HTMLElement>('.marketing-title-line');
      const eyebrow = document.querySelector('.marketing-eyebrow');
      const description = document.querySelector('.marketing-description');
      const actions = document.querySelector('.marketing-actions');
      const cinematicImage = document.querySelector('.cinematic-wall-image');
      const cinematicFrame = document.querySelector('.cinematic-wall-frame');

      const intro = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      intro
        .from(
          cinematicImage,
          {
            opacity: 0,
            scale: 1.15,
            duration: 1.4,
            ease: 'power2.out',
          },
          0
        )
        .from(
          cinematicFrame,
          {
            opacity: 0,
            scale: 0.98,
            duration: 1,
          },
          '-=0.8'
        )
        .from(eyebrow, {
          opacity: 0,
          y: 20,
          duration: 0.7,
        })
        .from(
          title,
          {
            opacity: 0,
            y: 70,
            rotateX: -20,
            stagger: 0.08,
            duration: 1,
          },
          '-=0.4'
        )
        .from(
          description,
          {
            opacity: 0,
            y: 25,
            duration: 0.7,
          },
          '-=0.5'
        )
        .from(
          actions,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          posters,
          {
            opacity: 0,
            y: 120,
            scale: 0.72,
            rotation: (index) =>
              Number(posters[index]?.dataset.initialRotation ?? 0) * 1.8,
            stagger: 0.08,
            duration: 1.1,
          },
          '-=0.9'
        );

      const wall = container.current?.querySelector('.poster-wall');

      if (!wall) return;

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: '+=900',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      scrollTimeline
        .to(cinematicImage, {
          opacity: 0.82,
          scale: 1,
          duration: 1,
        })
        .to(
          '.cinematic-wall-image',
          {
            scale: 1.04,
            xPercent: -2,
            duration: 1,
          },
          '<'
        )
        .to('.marketing-copy', {
          yPercent: -18,
          opacity: 0.15,
          scale: 0.96,
          duration: 1,
        })
        .to(
          '.poster-wall',
          {
            scale: 1.12,
            yPercent: -8,
            duration: 1,
          },
          '<'
        )
        .to(
          '.marketing-poster:nth-child(1)',
          {
            xPercent: -28,
            rotation: -18,
            duration: 1,
          },
          '<'
        )
        .to(
          '.marketing-poster:nth-child(2)',
          {
            xPercent: 18,
            yPercent: -12,
            rotation: 12,
            duration: 1,
          },
          '<'
        )
        .to(
          '.marketing-poster:nth-child(3)',
          {
            xPercent: -14,
            yPercent: 20,
            rotation: -8,
            duration: 1,
          },
          '<'
        )
        .to(
          '.marketing-poster:nth-child(4)',
          {
            xPercent: 20,
            yPercent: 14,
            rotation: 15,
            duration: 1,
          },
          '<'
        );
    },
    {
      scope: container,
    }
  );

  return (
    <section
      ref={container}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      <CinematicWall />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] left-[45%] size-[720px] rounded-full bg-primary/10 blur-[150px]" />

        <div className="absolute top-[25%] right-[-10%] size-[450px] rounded-full bg-primary/8 blur-[130px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,var(--background)_76%)]" />
      </div>

      <div className="relative container-content flex min-h-screen items-center">
        <div className="marketing-copy relative z-30 max-w-3xl py-24">
          <p className="marketing-eyebrow mb-7 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
            MovieShelf · Personal Cinema Archive
          </p>

          <h1 className="max-w-4xl font-heading text-6xl leading-[0.92] font-bold tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            <span className="marketing-title-line block">Your taste</span>

            <span className="marketing-title-line block">
              <span className="text-gradient-primary">deserves</span> a shelf.
            </span>
          </h1>

          <p className="marketing-description mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Discover films beyond the obvious. Keep the ones that matter. Rate
            what you&apos;ve seen and build a collection that feels unmistakably
            yours.
          </p>

          <div className="marketing-actions mt-9 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_var(--primary-glow)] transition-all duration-200 hover:bg-primary-hover"
            >
              Build your shelf
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#why"
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface/80 px-5 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-surface-hover"
            >
              Discover the idea
            </Link>
          </div>
        </div>

        <div
          className="poster-wall pointer-events-none absolute inset-0 hidden lg:block"
          style={{ perspective: '1400px' }}
        >
          {MARKETING_POSTERS.map((poster, index) => {
            const rotations = [-9, 4, -5, 8, -12, 7];

            return (
              <div
                key={poster.title}
                data-initial-rotation={rotations[index]}
                className="marketing-poster absolute top-1/2 left-1/2 w-[190px] overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_rgb(0_0_0_/_55%)] sm:w-[215px]"
                style={{
                  transform: `
                    translate(-50%, -50%)
                    rotate(${rotations[index]}deg)
                    translate(
                      ${(index % 2 === 0 ? -1 : 1) * (210 + index * 35)}px,
                      ${(index - 2.5) * 70}px
                    )
                  `,
                }}
              >
                <div className="relative aspect-[2/3]">
                  <img
                    src={poster.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/5" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xs font-semibold text-white">
                      {poster.title}
                    </p>

                    <p className="mt-1 text-[11px] text-white/55">
                      {poster.year} · ★ {poster.rating}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase md:flex">
        Scroll to explore
        <ArrowDown className="size-3 animate-bounce" />
      </div>
    </section>
  );
};

export default MarketingHero;
