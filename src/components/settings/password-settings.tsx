'use client';

import { setPasswordAction } from '@/lib/actions/password-action';
import { authClient } from '@/lib/auth/client';
import { passwordSchema } from '@/lib/validations/auth';
import { useEffect, useState, useTransition } from 'react';

const PasswordSettings = () => {
  const [hasCredential, setHasCredential] = useState<boolean | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadAccounts() {
      const { data } = await authClient.listAccounts();

      if (cancelled) {
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

  function resetMessages() {
    setError(null);
    setMessage(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    resetMessages();

    const parsed = passwordSchema.safeParse(newPassword);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid password.');

      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');

      return;
    }

    startTransition(async () => {
      if (hasCredential) {
        const { error: changePasswordError } = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });

        if (changePasswordError) {
          setError(
            changePasswordError.message ?? "We couldn't change your password."
          );

          return;
        }

        setMessage(
          'Your password has been changed. Other active sessions were signed out.'
        );
      } else {
        const result = await setPasswordAction(newPassword);

        if (!result.success) {
          setError(result.message ?? "We couldn't set your password.");

          return;
        }

        setMessage(result.message ?? 'Your password has been set.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    });
  }

  if (isLoading) {
    return (
      <div className="mt-6 text-sm text-muted-foreground">
        Loading password settings...
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      {hasCredential && (
        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-sm font-medium"
          >
            Current password
          </label>

          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              resetMessages();
            }}
            autoComplete="current-password"
            className="input"
            placeholder="••••••••"
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="newPassword" className="mb-2 block text-sm font-medium">
          {hasCredential ? 'New password' : 'Password'}
        </label>

        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(event) => {
            setNewPassword(event.target.value);
            resetMessages();
          }}
          autoComplete="new-password"
          className="input"
          placeholder="••••••••"
          required
        />
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
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            resetMessages();
          }}
          autoComplete="new-password"
          className="input"
          placeholder="••••••••"
          required
        />
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        Use at least 8 characters. You can use letters, numbers, and symbols.
      </p>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? 'Saving...'
            : hasCredential
              ? 'Change password'
              : 'Set password'}
        </button>
      </div>
    </form>
  );
};

export default PasswordSettings;
