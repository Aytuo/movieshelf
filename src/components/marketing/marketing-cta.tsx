'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMarketingAuth } from './marketing-auth-provider';

const MarketingCta = () => {
  const authenticated = useMarketingAuth();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12),transparent_55%)]" />

      <div className="relative container-content py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">
            {authenticated ? 'Welcome back' : 'Start your collection'}
          </p>

          <h2 className="mt-5 font-heading text-5xl font-bold tracking-tighter sm:text-6xl">
            {authenticated ? 'Keep building' : 'Start building'}
            <br />
            <span className="text-gradient-primary">your shelf.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Discover movies and TV shows, remember the ones that matter, and
            build a collection that says something about you.
          </p>

          <Link
            href={authenticated ? '/discover' : '/register'}
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_var(--primary-glow)] transition-all hover:bg-primary-hover"
          >
            {authenticated
              ? 'Discover something new'
              : 'Create your MovieShelf'}
            <ArrowRight className="size-4" />
          </Link>

          <p className="mt-5 text-xs text-muted-foreground">
            Built for people who love movies and TV shows.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketingCta;
