'use client';

import { authClient } from '@/lib/auth/client';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clapperboard, Loader2, LockKeyhole, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import AuthInput from './auth-input';
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
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Continue building your personal shelf.
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

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-200"
            >
              Password
            </label>

            <AuthInput
              id="password"
              type="password"
              icon={LockKeyhole}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register('password')}
            />

            {form.formState.errors.password && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-primary transition-colors hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            size="xl"
            disabled={isSubmitting}
            className="h-12 w-full transition-colors duration-300 hover:bg-primary-hover"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <SocialButtons />

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
