'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ProfileNavbarProps = {
  username: string;
};

const ProfileNavbar = ({ username }: ProfileNavbarProps) => {
  const pathname = usePathname();

  const basePath = `/profile/${username}`;

  const links = [
    {
      label: 'Overview',
      href: basePath,
      exact: true,
    },
    {
      label: 'Taste',
      href: `${basePath}/taste`,
      exact: false,
    },
    {
      label: 'Reviews',
      href: `${basePath}/reviews`,
      exact: false,
    },
    {
      label: 'Activity',
      href: `${basePath}/activity`,
      exact: false,
    },
  ];

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary/30 bg-primary-muted text-primary'
                : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default ProfileNavbar;
