'use client';

import { authClient } from '@/lib/auth/client';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clapperboard, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import AuthInput from './auth-input';

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
      <div className="w-full">
        <div className="rounded-2xl border border-white/10 bg-[#101217]/90 p-6 cinematic-glow backdrop-blur-xl sm:p-10">
          <Link
            href="/"
            aria-label="MovieShelf home"
            className="mb-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Clapperboard className="size-3.5" />
            </span>

            <span className="text-xl font-bold tracking-tight">
              Movie<span className="text-primary">Shelf</span>
            </span>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
              Reset link sent!
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              If an account exists for this email address, you&apos;ll receive a
              message with instructions to reset your password.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/3 p-5">
            <p className="text-sm leading-6 text-zinc-300">
              The link will expire in 1 hour. Check your spam folder if you
              don&apos;t see the email.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-zinc-400">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/10 bg-[#101217]/90 p-6 cinematic-glow backdrop-blur-xl sm:p-10">
        <Link
          href="/"
          aria-label="MovieShelf home"
          className="mb-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Clapperboard className="size-3.5" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Movie<span className="text-primary">Shelf</span>
          </span>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
            Forgot your password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Enter your email address. If an account is linked to it, we&apos;ll
            send a password reset link to recover your account.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-200"
            >
              Email address
            </label>

            <AuthInput
              id="email"
              type="email"
              icon={Mail}
              autoComplete="email"
              placeholder="johndoe@example.com"
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register('email')}
            />

            {form.formState.errors.email && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="xl"
            className="h-12 w-full transition-colors duration-300 hover:bg-primary-hover"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Sending link...' : 'Send reset link'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
