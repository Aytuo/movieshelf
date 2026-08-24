import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { auth } from '@/lib/auth';
import { getProfileByUserId } from '@/lib/repositories/profile-repository';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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

  let profile = null;

  if (session) {
    profile = await getProfileByUserId(session.user.id);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={session.user} profile={profile} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default AppLayout;
