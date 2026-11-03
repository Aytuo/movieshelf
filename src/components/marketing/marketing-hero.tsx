'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import CinematicWall, { CinematicCountdown } from './cinematic-wall';
import { useMarketingAuth } from './marketing-auth-provider';

gsap.registerPlugin(ScrollTrigger);

const MARKETING_POSTER_POSITIONS = [
  { x: '30%', y: '26%', z: 70, rotateX: 7, rotateY: -14, scale: 0.98 },
  { x: '78%', y: '25%', z: -35, rotateX: -6, rotateY: 12, scale: 0.92 },
  { x: '48%', y: '52%', z: 55, rotateX: 4, rotateY: -8, scale: 1.02 },
  { x: '85%', y: '56%', z: -55, rotateX: 9, rotateY: 15, scale: 0.93 },
  { x: '31%', y: '78%', z: 85, rotateX: -8, rotateY: -12, scale: 0.98 },
  { x: '73%', y: '77%', z: 20, rotateX: 5, rotateY: 9, scale: 0.96 },
];

const MARKETING_POSTER_SCROLL_MOTION = [
  {
    x: -42,
    y: -52,
    rotation: -3,
    rotationX: -3,
    rotationY: 5,
    scale: 1.09,
  },
  {
    x: 48,
    y: -34,
    rotation: 2,
    rotationX: 3,
    rotationY: -5,
    scale: 0.96,
  },
  {
    x: -38,
    y: 42,
    rotation: -2,
    rotationX: -4,
    rotationY: 4,
    scale: 1.07,
  },
  {
    x: 42,
    y: 36,
    rotation: 3,
    rotationX: 3,
    rotationY: -4,
    scale: 0.95,
  },
  {
    x: -34,
    y: -38,
    rotation: -3,
    rotationX: -3,
    rotationY: 5,
    scale: 1.08,
  },
  {
    x: 36,
    y: -30,
    rotation: 2,
    rotationX: 3,
    rotationY: -5,
    scale: 0.96,
  },
];

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
  const authenticated = useMarketingAuth();
  const container = useRef<HTMLDivElement>(null);

  const introScrollLock = useRef<{
    htmlOverflow: string;
    bodyOverflow: string;
  } | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflowX = html.style.overflowX;
    const previousBodyOverflowX = body.style.overflowX;

    html.style.overflowX = 'clip';
    body.style.overflowX = 'clip';

    return () => {
      html.style.overflowX = previousHtmlOverflowX;
      body.style.overflowX = previousBodyOverflowX;

      const previous = introScrollLock.current;

      if (!previous) return;

      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;

      introScrollLock.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const html = document.documentElement;
      const body = document.body;

      introScrollLock.current = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
      };

      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';

      const unlockIntroScroll = () => {
        const previous = introScrollLock.current;

        if (!previous) return;

        html.style.overflow = previous.htmlOverflow;
        body.style.overflow = previous.bodyOverflow;

        introScrollLock.current = null;
      };

      const posters = gsap.utils.toArray<HTMLElement>('.marketing-poster');
      const title = gsap.utils.toArray<HTMLElement>('.marketing-title-line');
      const eyebrow = document.querySelector('.marketing-eyebrow');
      const description = document.querySelector('.marketing-description');
      const actions = document.querySelector('.marketing-actions');
      const countdown = document.querySelector('.cinematic-countdown');
      const countdownDial = document.querySelector('.cinematic-countdown-dial');
      const countdownRing = document.querySelector('.cinematic-countdown-ring');
      const countdownFlash = document.querySelector(
        '.cinematic-countdown-flash'
      );
      const countdownSeam = document.querySelector('.cinematic-countdown-seam');
      const countdownVerticalSeam = document.querySelector(
        '.cinematic-countdown-seam-vertical'
      );
      const curtainTop = document.querySelector('.cinematic-curtain-top');
      const curtainBottom = document.querySelector('.cinematic-curtain-bottom');

      const countdownNumbers =
        countdown?.querySelectorAll<HTMLElement>(
          '.cinematic-countdown-number'
        ) ?? [];

      const intro = gsap.timeline({
        defaults: {
          ease: 'power3.out',
        },
      });

      intro.to({}, { duration: 0.35 });

      countdownNumbers.forEach((number, index) => {
        const position = 0.35 + index * 0.9;

        intro
          .fromTo(
            number,
            {
              autoAlpha: 0,
              scale: 0.78,
              filter: 'blur(10px)',
            },
            {
              autoAlpha: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.22,
              ease: 'power3.out',
            },
            position
          )
          .to(
            number,
            {
              autoAlpha: 0,
              scale: 1.12,
              filter: 'blur(5px)',
              duration: 0.18,
              ease: 'power2.in',
            },
            position + 0.62
          );

        intro
          .to(
            countdownFlash,
            {
              opacity: 0.12,
              duration: 0.035,
              ease: 'none',
            },
            position
          )
          .to(
            countdownFlash,
            {
              opacity: 0,
              duration: 0.12,
              ease: 'none',
            },
            position + 0.035
          );
      });

      intro
        .to(
          countdownRing,
          {
            rotation: 360,
            duration: 2.85,
            ease: 'none',
            transformOrigin: '50% 50%',
          },
          0.35
        )
        .to(
          countdownDial,
          {
            autoAlpha: 0,
            scale: 1.08,
            duration: 0.25,
            ease: 'power2.in',
          },
          '+=0.05'
        )
        .to(
          countdownVerticalSeam,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: 'power1.out',
          },
          '<'
        )
        .to(
          countdownSeam,
          {
            autoAlpha: 0,
            duration: 0.35,
            ease: 'power1.out',
          },
          'curtainOpen'
        )
        .to(
          curtainTop,
          {
            yPercent: -105,
            duration: 1.35,
            ease: 'power4.inOut',
          },
          'curtainOpen'
        )
        .to(
          curtainBottom,
          {
            yPercent: 105,
            duration: 1.35,
            ease: 'power4.inOut',
          },
          '<'
        )
        .to(
          countdown,
          {
            autoAlpha: 0,
            duration: 0.25,
            ease: 'power1.out',
          },
          'curtainOpen+=1.05'
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

      intro.eventCallback('onComplete', () => {
        unlockIntroScroll();

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
          .to('.marketing-copy', {
            yPercent: -24,
            opacity: 0,
            scale: 0.96,
            duration: 1,
            ease: 'none',
          })
          .to(
            '.poster-wall',
            {
              scale: 1.05,
              yPercent: -4,
              duration: 1,
              ease: 'none',
            },
            '<'
          )
          .to(
            posters,
            {
              x: (index) => MARKETING_POSTER_SCROLL_MOTION[index].x,
              y: (index) => MARKETING_POSTER_SCROLL_MOTION[index].y,
              rotation: (index) =>
                MARKETING_POSTER_SCROLL_MOTION[index].rotation,
              rotationX: (index) =>
                MARKETING_POSTER_SCROLL_MOTION[index].rotationX,
              rotationY: (index) =>
                MARKETING_POSTER_SCROLL_MOTION[index].rotationY,
              scale: (index) => MARKETING_POSTER_SCROLL_MOTION[index].scale,
              duration: 1,
              stagger: 0.07,
              ease: 'none',
            },
            '<'
          );
      });
    },
    {
      scope: container,
    }
  );

  return (
    <>
      <CinematicCountdown />

      <section
        ref={container}
        className="relative min-h-screen overflow-hidden bg-background"
      >
        <CinematicWall />

        <div className="relative container-content flex min-h-screen items-center">
          <div className="marketing-copy relative z-30 w-full max-w-3xl py-24 lg:w-[48%] lg:max-w-[34rem]">
            <p className="marketing-eyebrow mb-7 text-xs font-semibold tracking-[0.24em] text-primary uppercase">
              Movies &amp; TV, curated by you
            </p>

            <h1 className="max-w-4xl font-heading text-6xl leading-[0.92] font-bold tracking-[-0.065em] sm:text-7xl lg:text-7xl xl:text-8xl">
              <span className="marketing-title-line block">Your taste</span>

              <span className="marketing-title-line block">
                <span className="text-gradient-primary">deserves</span> a shelf.
              </span>
            </h1>

            <p className="marketing-description mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover movies and TV shows beyond the obvious. Keep the ones
              that matter. Rate what you&apos;ve seen and build a collection
              that feels unmistakably yours.
            </p>

            <div className="marketing-actions mt-9 flex flex-wrap gap-3">
              <Link
                href={authenticated ? '/shelf' : '/register'}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_var(--primary-glow)] transition-all duration-200 hover:bg-primary-hover"
              >
                {authenticated ? 'View your shelf' : 'Build your shelf'}
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
            className="poster-wall pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block"
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            {MARKETING_POSTERS.map((poster, index) => {
              const rotations = [-9, 4, -5, 8, -12, 7];
              const position = MARKETING_POSTER_POSITIONS[index];

              return (
                <div
                  key={poster.title}
                  className="marketing-poster-position absolute w-[140px] sm:w-[160px] xl:w-[180px]"
                  style={{
                    top: position.y,
                    left: position.x,
                    transform: `
                      translate(-50%, -50%)
                      translateZ(${position.z}px)
                      rotateX(${position.rotateX}deg)
                      rotateY(${position.rotateY}deg)
                      rotateZ(${rotations[index]}deg)
                      scale(${position.scale})
                    `,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    data-initial-rotation={rotations[index]}
                    className="marketing-poster relative w-full overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_80px_rgb(0_0_0/55%)]"
                  >
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={poster.image}
                        alt=""
                        fill
                        sizes="215px"
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-white/5" />

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
    </>
  );
};

export default MarketingHero;
