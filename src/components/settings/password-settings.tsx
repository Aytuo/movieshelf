'use client';

import { setPasswordAction } from '@/lib/actions/password-action';
import { authClient } from '@/lib/auth/client';
import {
  passwordSettingsSchema,
  type PasswordSettingsInput,
} from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type PasswordFieldProps = {
  id: string;
  label: string;
  type: 'currentPassword' | 'newPassword' | 'confirmPassword';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
};

function PasswordField({
  id,
  label,
  type,
  value,
  onChange,
  error,
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="pr-11"
          placeholder="••••••••"
          required={type !== 'currentPassword'}
          aria-invalid={Boolean(error)}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={visible}
          className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}

const PasswordSettings = () => {
  const [hasCredential, setHasCredential] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [loadError, setLoadError] = useState<string | null>(null);

  const form = useForm<PasswordSettingsInput>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const currentPassword = useWatch({
    control: form.control,
    name: 'currentPassword',
  });

  const newPassword = useWatch({
    control: form.control,
    name: 'newPassword',
  });

  const confirmPassword = useWatch({
    control: form.control,
    name: 'confirmPassword',
  });

  useEffect(() => {
    let cancelled = false;

    async function loadAccounts() {
      const { data, error } = await authClient.listAccounts();

      if (cancelled) {
        return;
      }

      if (error) {
        setLoadError(
          error.message ?? "We couldn't load your password settings."
        );
        setIsLoading(false);
        return;
      }

      setHasCredential(
        data?.some((account) => account.providerId === 'credential') ?? false
      );

      setIsLoading(false);
    }

    void loadAccounts();

    return () => {
      cancelled = true;
    };
  }, []);

  function submit(values: PasswordSettingsInput) {
    if (hasCredential && !values.currentPassword.trim()) {
      form.setError('currentPassword', {
        type: 'required',
        message: 'Current password is required.',
      });

      return;
    }

    startTransition(async () => {
      if (hasCredential) {
        const { error } = await authClient.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          revokeOtherSessions: true,
        });

        if (error) {
          toast.error(error.message ?? "We couldn't change your password.");
          return;
        }

        toast.success(
          'Your password has been changed. Other active sessions were signed out.'
        );
      } else {
        const result = await setPasswordAction(values.newPassword);

        if (!result.success) {
          toast.error(result.message ?? "We couldn't set your password.");
          return;
        }

        toast.success(result.message ?? 'Your password has been set.');
      }

      form.reset();
    });
  }

  if (isLoading) {
    return (
      <div className="mt-6 text-sm text-muted-foreground">
        Loading password settings...
      </div>
    );
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
      >
        {loadError}
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-5">
      {hasCredential && (
        <PasswordField
          id="currentPassword"
          label="Current password"
          type="currentPassword"
          value={currentPassword}
          onChange={(value) => {
            form.setValue('currentPassword', value, {
              shouldValidate: true,
            });
          }}
          error={form.formState.errors.currentPassword?.message}
          autoComplete="current-password"
        />
      )}

      <PasswordField
        id="newPassword"
        label={hasCredential ? 'New password' : 'Password'}
        type="newPassword"
        value={newPassword}
        onChange={(value) => {
          form.setValue('newPassword', value, {
            shouldValidate: true,
          });
        }}
        error={form.formState.errors.newPassword?.message}
        autoComplete="new-password"
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        type="confirmPassword"
        value={confirmPassword}
        onChange={(value) => {
          form.setValue('confirmPassword', value, {
            shouldValidate: true,
          });
        }}
        error={form.formState.errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      <p className="text-xs leading-5 text-muted-foreground">
        Use at least 8 characters. You can use letters, numbers, and symbols.
      </p>

      <div className="flex justify-end">
        <Button type="submit" size="xl" disabled={isPending}>
          {isPending
            ? 'Saving...'
            : hasCredential
              ? 'Change password'
              : 'Set password'}
        </Button>
      </div>
    </form>
  );
};

export default PasswordSettings;
