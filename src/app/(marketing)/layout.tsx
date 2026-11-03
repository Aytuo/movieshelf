import Footer from '@/components/layout/footer';
import { MarketingAuthProvider } from '@/components/marketing/marketing-auth-provider';
import MarketingNavbar from '@/components/marketing/marketing-navbar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const MarketingLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen w-full max-w-full min-w-0 flex-col overflow-x-clip">
      <MarketingNavbar authenticated={Boolean(session)} />

      <MarketingAuthProvider authenticated={Boolean(session)}>
        <main className="w-full max-w-full min-w-0 flex-1">{children}</main>
      </MarketingAuthProvider>

      <Footer authenticated={Boolean(session)} />
    </div>
  );
};

export default MarketingLayout;
