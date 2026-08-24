import Link from 'next/link';

const settingsNavigation = [
  {
    label: 'Profile',
    href: '/profile',
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

const SettingsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="container-content py-10 lg:py-14">
      <div className="mb-10">
        <p className="eyebrow">Account</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage your MovieShelf profile and account.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
        <nav className="h-fit">
          <div className="rounded-xl border border-border p-2 surface">
            {settingsNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
