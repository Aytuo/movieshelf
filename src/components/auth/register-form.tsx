'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { authClient } from '@/lib/auth/client';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import SocialButtons from './social-buttons';

const RegisterForm = () => {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);

    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: '/home',
    });

    if (error) {
      setServerError(
        error.message ?? 'Unable to create your account. Please try again.'
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
        <p className="text-sm font-medium text-primary">
          Start your collection
        </p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Create your MovieShelf
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Build your personal movie taste, one film at a time.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            {...form.register('name')}
            className="input"
            placeholder="John Doe"
          />

          {form.formState.errors.name && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

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
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            Confirm password
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register('confirmPassword')}
            className="input"
            placeholder="••••••••"
          />

          {form.formState.errors.confirmPassword && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
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
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
