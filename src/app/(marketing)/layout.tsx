import Footer from '@/components/layout/footer';
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

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default MarketingLayout;
