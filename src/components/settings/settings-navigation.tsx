'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const settingsNavigation = [
  {
    label: 'Profile',
    href: '/settings/profile',
  },
  {
    label: 'Security',
    href: '/settings/security',
  },
  {
    label: 'Connected accounts',
    href: '/settings/accounts',
  },
];

const SettingsNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="h-fit">
      <div className="rounded-xl border border-border p-2 surface">
        {settingsNavigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-surface-hover text-foreground'
                  : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground',
              ].join(' ')}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SettingsNavigation;
