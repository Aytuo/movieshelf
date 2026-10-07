'use client';

import { authClient } from '@/lib/auth/client';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const ForgotPasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const redirectTo = `${window.location.origin}/reset-password`;

    const { error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo,
    });

    if (error) {
      toast.error(
        error.message ?? "Couldn't send password reset instructions."
      );

      return;
    }

    toast.success('Check your inbox.', {
      description:
        'If an account exists for this email, we sent password reset instructions.',
    });

    setSubmitted(true);
  }

  const isSubmitting = form.formState.isSubmitting;

  if (submitted) {
    return (
      <div>
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Check your inbox</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Reset link sent
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            If an account exists for this email address, you&apos;ll receive a
            message with instructions to reset your password.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-sm leading-6 text-muted-foreground">
            The link will expire in 1 hour. Check your spam folder if you
            don&apos;t see the email.
          </p>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-foreground hover:text-primary"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Account recovery</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Forgot your password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter your email and we&apos;ll send you a secure link to choose a new
          password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register('email')}
            placeholder="you@example.com"
            aria-invalid={Boolean(form.formState.errors.email)}
          />

          {form.formState.errors.email && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending link...' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground hover:text-primary"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
