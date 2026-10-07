'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { authClient } from '@/lib/auth/client';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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

          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...form.register('name')}
            placeholder="John Doe"
            aria-invalid={Boolean(form.formState.errors.name)}
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

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>

          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register('password')}
            placeholder="••••••••"
            aria-invalid={Boolean(form.formState.errors.password)}
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

          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register('confirmPassword')}
            placeholder="••••••••"
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
          />

          {form.formState.errors.confirmPassword && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
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
