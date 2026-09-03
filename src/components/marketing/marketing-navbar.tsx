import { ArrowRight, Clapperboard } from 'lucide-react';
import Link from 'next/link';

type MarketingNavbarProps = {
  authenticated?: boolean;
};

const MarketingNavbar = ({ authenticated = false }: MarketingNavbarProps) => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="container-content">
        <div className="flex h-20 items-center justify-between">
          <Link
            href={authenticated ? '/home' : '/'}
            className="group flex items-center gap-2.5"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary-glow)] transition-transform duration-200 group-hover:scale-105">
              <Clapperboard className="size-4" />
            </span>

            <span className="text-lg font-bold tracking-tight">
              Movie<span className="text-primary">Shelf</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#why"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              The idea
            </Link>

            <Link
              href="#shelf"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Your Shelf
            </Link>

            <Link
              href="#taste"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Your Taste
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {authenticated ? (
              <Link
                href="/home"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                Open MovieShelf
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden h-10 items-center rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Join MovieShelf
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MarketingNavbar;
