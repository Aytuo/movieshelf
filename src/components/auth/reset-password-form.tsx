'use client';

import { authClient } from '@/lib/auth/client';
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Account recovery</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Set a new password
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Choose a new password for your MovieShelf account.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium"
          >
            New password
          </label>

          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            {...form.register('newPassword')}
            className="input"
            placeholder="••••••••"
          />

          {form.formState.errors.newPassword && (
            <p className="mt-2 text-xs text-destructive">
              {form.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
          >
            Confirm new password
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Updating password...' : 'Update password'}
        </button>
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

export default ResetPasswordForm;
