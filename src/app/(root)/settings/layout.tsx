import SettingsNavigation from '@/components/settings/settings-navigation';

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
        <SettingsNavigation />

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
