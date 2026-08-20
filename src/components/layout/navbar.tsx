'use client';

import { cn } from '@/lib/utils';
import {
  Bookmark,
  Film,
  Heart,
  Menu,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  {
    label: 'Discover',
    href: '/discover',
    icon: Film,
  },
  {
    label: 'My Shelf',
    href: '/shelf',
    icon: Bookmark,
  },
  {
    label: 'Favorites',
    href: '/favorites',
    icon: Heart,
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-content">
        <div className="flex h-(--header-height) items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary-glow)] transition-transform duration-200 group-hover:scale-105">
              <Film className="size-4" strokeWidth={2.2} />
            </span>

            <span className="text-lg font-bold tracking-tight">
              Movie<span className="text-primary">Shelf</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={isActive}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/search"
              aria-label="Search movies"
              className={cn(
                'flex size-9 items-center justify-center rounded-lg',
                'text-muted-foreground transition-colors',
                'hover:bg-surface-hover hover:text-foreground'
              )}
            >
              <Search className="size-4" />
            </Link>

            <Link
              href="/profile"
              aria-label="Profile"
              className={cn(
                'flex size-9 items-center justify-center rounded-lg',
                'border border-border bg-surface',
                'text-muted-foreground transition-colors',
                'hover:border-border-strong hover:text-foreground'
              )}
            >
              <UserRound className="size-4" />
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((current) => !current)}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="border-t border-border/60 py-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-muted text-foreground'
                        : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                    )}
                  >
                    <Icon className="size-4" />

                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 h-px bg-border/60" />

              <Link
                href="/search"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <Search className="size-4" />
                Search
              </Link>

              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                <UserRound className="size-4" />
                Profile
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
