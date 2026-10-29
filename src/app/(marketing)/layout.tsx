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
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar authenticated={Boolean(session)} />

      <MarketingAuthProvider authenticated={Boolean(session)}>
        <main className="flex-1">{children}</main>
      </MarketingAuthProvider>

      <Footer authenticated={Boolean(session)} />
    </div>
  );
};

export default MarketingLayout;
