'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth/client';
import { CheckCircle2, Mail, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

type VerificationState = 'pending' | 'verified' | 'error';

type EmailVerificationCardProps = {
  state: VerificationState;
  initialEmail?: string;
};

const VERIFICATION_CALLBACK = '/verify-email?verified=true';

export default function EmailVerificationCard({
  state,
  initialEmail = '',
}: EmailVerificationCardProps) {
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function resendVerification() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setEmailError('Enter your email address.');
      return;
    }

    setEmailError(null);
    setIsPending(true);

    try {
      const { error } = await authClient.sendVerificationEmail({
        email: normalizedEmail,
        callbackURL: VERIFICATION_CALLBACK,
      });

      if (error) {
        toast.error(error.message ?? "Couldn't send the verification email.");

        return;
      }

      toast.success('Verification email sent.', {
        description: 'Check your inbox for the new verification link.',
      });
    } finally {
      setIsPending(false);
    }
  }

  if (state === 'verified') {
    return (
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary-muted text-primary">
            <CheckCircle2 className="size-7" />
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight">
            Email verified
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Your email address has been verified. Your MovieShelf account is
            ready.
          </p>

          <Link
            href="/home"
            className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Continue to MovieShelf
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = state === 'error';

  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary-muted text-primary">
          {isExpired ? (
            <TriangleAlert className="size-7" />
          ) : (
            <Mail className="size-7" />
          )}
        </div>

        <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight">
          {isExpired ? 'Verification link expired' : 'Check your inbox'}
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {isExpired
            ? 'This verification link is no longer valid. Request a new one below.'
            : 'We sent you a verification link. Open it to finish setting up your MovieShelf account.'}
        </p>
      </div>

      <div className="mt-8">
        <label
          htmlFor="verification-email"
          className="mb-2 block text-sm font-medium"
        >
          Email
        </label>

        <Input
          id="verification-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setEmailError(null);
          }}
          disabled={isPending}
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
        />

        {emailError && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {emailError}
          </p>
        )}
      </div>

      <Button
        type="button"
        onClick={() => void resendVerification()}
        disabled={isPending}
        className="mt-5 h-11 w-full bg-primary px-6 hover:bg-primary-hover"
      >
        {isPending ? 'Sending...' : 'Resend verification email'}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already verified?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
