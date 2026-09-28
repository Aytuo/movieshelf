'use client';

import { updateProfileSettings } from '@/lib/actions/profile-action';
import { useState, useTransition } from 'react';

type ProfileSettingsFormProps = {
  initialValues: {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl: string;
  };
};

const ProfileSettingsForm = ({ initialValues }: ProfileSettingsFormProps) => {
  const [form, setForm] = useState(initialValues);

  const [message, setMessage] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  function updateField<T extends keyof typeof form>(
    field: T,
    value: (typeof form)[T]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage(null);
    setError(null);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await updateProfileSettings(form);

      if (!result.success) {
        setError(result.message ?? "We couldn't save your profile.");

        return;
      }

      setMessage(result.message ?? 'Profile updated.');

      window.location.reload();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <div className="mb-6">
          <h3 className="text-sm font-semibold">Public profile</h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            This information can be visible on your MovieShelf profile.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                @
              </span>

              <input
                id="username"
                value={form.username}
                onChange={(event) =>
                  updateField('username', event.target.value.toLowerCase())
                }
                className="input pl-7"
                autoComplete="username"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Your public profile URL:{' '}
              <span className="text-foreground">
                /profile/
                {form.username || 'username'}
              </span>
            </p>
          </div>

          <div>
            <label htmlFor="displayName" className="label">
              Display name
            </label>

            <input
              id="displayName"
              value={form.displayName}
              onChange={(event) =>
                updateField('displayName', event.target.value)
              }
              className="input"
              placeholder="Alex Johnson"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="label">
              Bio
            </label>

            <textarea
              id="bio"
              value={form.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              rows={5}
              maxLength={280}
              className="min-h-28 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="A few words about your relationship with movies..."
            />

            <div className="mt-2 text-right text-[11px] text-muted-foreground">
              {form.bio.length}/280
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
