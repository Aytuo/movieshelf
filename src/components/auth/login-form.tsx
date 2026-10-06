'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { authClient } from '@/lib/auth/client';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { toast } from 'sonner';
import SocialButtons from './social-buttons';

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginInput) {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: '/home',
    });

    if (error) {
      if (error.status === 403) {
        const { error: verificationError } =
          await authClient.sendVerificationEmail({
            email: values.email,
            callbackURL: '/verify-email?verified=true',
          });

        if (verificationError) {
          toast.error(
            verificationError.message ?? "Couldn't send the verification email."
          );

          return;
        }

        toast.error('Please verify your email address.', {
          description: 'We sent you a new verification link.',
        });

        router.replace(
          `/verify-email?pending=true&email=${encodeURIComponent(values.email)}`
        );

        return;
      }

      toast.error(
        error.message ?? "Couldn't sign in. Please check your credentials."
      );

      return;
    }

    router.replace('/home');
    router.refresh();
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Welcome back</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Sign in to MovieShelf
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Continue building your personal movie collection.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register('email')}
            className="input"
            placeholder="you@example.com"
          />

          {form.formState.errors.email && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
            className="input"
            placeholder="••••••••"
          />

          {form.formState.errors.password && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />

        <span className="text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
          or continue with
        </span>

        <div className="h-px flex-1 bg-border" />
      </div>

      <SocialButtons />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-foreground hover:text-primary"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
