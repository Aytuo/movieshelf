'use client';

import { authClient } from '@/lib/auth/client';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Clapperboard,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import AuthInput from './auth-input';
import SocialButtons from './social-buttons';

const RegisterForm = () => {
  const router = useRouter();

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
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: '/verify-email?verified=true',
    });

    if (error) {
      toast.error(
        error.message ?? "Couldn't create your account. Please try again."
      );

      return;
    }

    const { error: verificationError } = await authClient.sendVerificationEmail(
      {
        email: values.email,
        callbackURL: '/verify-email?verified=true',
      }
    );

    if (verificationError) {
      toast.error(
        verificationError.message ??
          "Your account was created, but we couldn't send the verification email."
      );

      return;
    }

    toast.success('Account created.', {
      description: 'Check your inbox to verify your email address.',
    });

    router.replace(
      `/verify-email?pending=true&email=${encodeURIComponent(values.email)}`
    );
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-[#101217]/90 p-5 cinematic-glow backdrop-blur-xl sm:p-7">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Clapperboard className="size-3.5" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Movie<span className="text-primary">Shelf</span>
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Start your collection and discover your taste in movies and TV
            shows, one title at a time.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
          noValidate
        >
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-zinc-200"
            >
              Name
            </label>

            <AuthInput
              id="name"
              type="text"
              icon={UserRound}
              className="h-10"
              autoComplete="name"
              placeholder="John Doe"
              disabled={form.formState.isSubmitting}
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register('name')}
            />

            {form.formState.errors.name && (
              <p
                role="alert"
                className="mt-1 text-xs leading-4 text-destructive"
              >
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
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
              className="h-10"
              autoComplete="email"
              placeholder="johndoe@example.com"
              disabled={form.formState.isSubmitting}
              aria-invalid={Boolean(form.formState.errors.email)}
              {...form.register('email')}
            />

            {form.formState.errors.email && (
              <p
                role="alert"
                className="mt-1 text-xs leading-4 text-destructive"
              >
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
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
              className="h-10"
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={form.formState.isSubmitting}
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register('password')}
            />

            {form.formState.errors.password && (
              <p
                role="alert"
                className="mt-1 text-xs leading-4 text-destructive"
              >
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-200"
            >
              Confirm password
            </label>

            <AuthInput
              id="confirmPassword"
              type="password"
              icon={LockKeyhole}
              className="h-10"
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={form.formState.isSubmitting}
              aria-invalid={Boolean(form.formState.errors.confirmPassword)}
              {...form.register('confirmPassword')}
            />

            {form.formState.errors.confirmPassword && (
              <p
                role="alert"
                className="mt-1 text-xs leading-4 text-destructive"
              >
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2 h-11 w-full transition-colors duration-300 hover:bg-primary-hover"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <SocialButtons />

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
