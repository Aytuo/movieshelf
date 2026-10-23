import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { NavbarSkeleton } from '@/components/skeletons/shared-skeletons';
import { auth } from '@/lib/auth';
import { ensureProfile } from '@/lib/services/profile-service';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

type NavbarUser = Parameters<typeof Navbar>[0]['user'];

async function ProfiledNavbar({ user }: { user: NavbarUser }) {
  const profile = await ensureProfile({
    userId: user.id,
    name: user.name,
    email: user.email,
  });

  return <Navbar user={user} profile={profile} />;
}

const AppLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarSkeleton />}>
        <ProfiledNavbar user={session.user} />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default AppLayout;
