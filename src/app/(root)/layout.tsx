import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { auth } from '@/lib/auth';
import { ensureProfile } from '@/lib/services/profile-service';
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

  const profile = await ensureProfile({
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={session.user} profile={profile} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
};

export default AppLayout;
