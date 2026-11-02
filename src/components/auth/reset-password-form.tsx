'use client';

import { authClient } from '@/lib/auth/client';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clapperboard, Loader2, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import AuthInput from './auth-input';

type ResetPasswordFormProps = {
  token: string;
};

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ResetPasswordInput) {
    const { error } = await authClient.resetPassword({
      newPassword: values.newPassword,
      token,
    });

    if (error) {
      toast.error(
        error.message ??
          'The reset link is invalid or expired. Please request a new one.'
      );

      return;
    }

    toast.success('Password updated.', {
      description: 'You can now sign in with your new password.',
    });

    router.replace('/login');
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/10 bg-[#101217]/90 p-6 cinematic-glow backdrop-blur-xl sm:p-10">
        <div className="mb-8 flex items-center justify-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Clapperboard className="size-3.5" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            Movie<span className="text-primary">Shelf</span>
          </span>
        </div>

        <div className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
            Set a new password
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Choose a strong password you haven&apos;t used elsewhere.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-2">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-zinc-200"
            >
              New password
            </label>

            <AuthInput
              id="newPassword"
              type="password"
              icon={LockKeyhole}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.newPassword)}
              {...form.register('newPassword')}
            />

            {form.formState.errors.newPassword && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-zinc-200"
            >
              Confirm new password
            </label>

            <AuthInput
              id="confirmPassword"
              type="password"
              icon={LockKeyhole}
              autoComplete="new-password"
              placeholder="••••••••"
              disabled={isSubmitting}
              aria-invalid={Boolean(form.formState.errors.confirmPassword)}
              {...form.register('confirmPassword')}
            />

            {form.formState.errors.confirmPassword && (
              <p role="alert" className="text-sm text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="xl"
            disabled={isSubmitting}
            className="h-12 w-full transition-colors duration-300 hover:bg-primary-hover"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? 'Updating password...' : 'Update password'}
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

export default ResetPasswordForm;
