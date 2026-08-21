import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const AuthLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/home');
  }

  return <main className="min-h-screen bg-background">{children}</main>;
};

export default AuthLayout;
