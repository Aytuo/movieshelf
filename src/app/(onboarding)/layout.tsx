import { auth } from '@/lib/auth';
import { getProfileByUserId } from '@/lib/repositories/profile-repository';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const OnboardingLayout = async ({
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

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) {
    redirect('/home');
  }

  // TODO: Add CTA to complete onboarding
  // if (profile.onboardingCompleted) {
  //   redirect('/home');
  // }

  return <main className="min-h-screen bg-background">{children}</main>;
};

export default OnboardingLayout;
