'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useMarketingAuth } from './marketing-auth-provider';
import { withMarketingMotion } from './marketing-motion';

const MarketingCta = () => {
  const authenticated = useMarketingAuth();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;

      if (!section) return;

      return withMarketingMotion(section, (root) => {
        const content = root.querySelector('.marketing-cta-content');
        const eyebrow = root.querySelector('.marketing-cta-eyebrow');
        const title = root.querySelector('.marketing-cta-title');
        const description = root.querySelector('.marketing-cta-description');
        const button = root.querySelector('.marketing-cta-button');
        const footer = root.querySelector('.marketing-cta-footer');

        const timeline = gsap.timeline({
          defaults: {
            ease: 'none',
          },
          scrollTrigger: {
            trigger: content,
            start: 'top 90%',
            end: 'bottom 15%',
            scrub: 0.8,
          },
        });

        timeline
          .fromTo(
            eyebrow,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.7 }
          )
          .fromTo(
            title,
            { autoAlpha: 0, y: 38 },
            { autoAlpha: 1, y: 0, duration: 1.4 },
            0.35
          )
          .fromTo(
            description,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 1 },
            1.15
          )
          .fromTo(
            button,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            1.9
          )
          .fromTo(
            footer,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            2.35
          );
      });
    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_55%)]" />

      <div className="relative container-content py-24 lg:py-32">
        <div className="marketing-cta-content mx-auto max-w-3xl text-center">
          <p className="marketing-cta-eyebrow eyebrow">
            {authenticated ? 'Welcome back' : 'Start your collection'}
          </p>

          <h2 className="marketing-cta-title mt-5 font-heading text-5xl font-bold tracking-tighter sm:text-6xl">
            {authenticated ? 'Keep building' : 'Start building'}
            <br />
            <span className="text-gradient-primary">your shelf.</span>
          </h2>

          <p className="marketing-cta-description mx-auto mt-6 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Discover movies and TV shows, remember the ones that matter, and
            build a collection that says something about you.
          </p>

          <Link
            href={authenticated ? '/discover' : '/register'}
            className="marketing-cta-button mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_var(--primary-glow)] transition-all hover:bg-primary-hover"
          >
            {authenticated
              ? 'Discover something new'
              : 'Create your MovieShelf'}
            <ArrowRight className="size-4" />
          </Link>

          <p className="marketing-cta-footer mt-5 text-xs text-muted-foreground">
            Built for people who love movies and TV shows.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketingCta;
