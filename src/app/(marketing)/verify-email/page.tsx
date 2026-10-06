import EmailVerificationCard from '@/components/auth/email-verification-card';
import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type VerifyEmailPageProps = {
  searchParams: Promise<{
    pending?: string;
    verified?: string;
    error?: string;
    email?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Verify your email',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;

  const isPending = params.pending === 'true';
  const isVerified = params.verified === 'true';
  const isInvalidToken = params.error?.toLowerCase() === 'invalid_token';

  if (!isPending && !isVerified && !isInvalidToken) {
    redirect('/');
  }

  if (isVerified) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user.emailVerified) {
      redirect('/');
    }
  }

  return (
    <section className="container-content flex min-h-[calc(100vh-var(--header-height))] items-center justify-center py-16">
      <EmailVerificationCard
        state={isVerified ? 'verified' : isInvalidToken ? 'error' : 'pending'}
        initialEmail={params.email}
      />
    </section>
  );
}
