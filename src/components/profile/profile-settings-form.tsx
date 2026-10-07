'use client';

import { updateProfileSettings } from '@/lib/actions/profile-action';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type ProfileSettingsFormProps = {
  initialValues: {
    username: string;
    displayName: string;
    bio: string;
  };
};

const ProfileSettingsForm = ({ initialValues }: ProfileSettingsFormProps) => {
  const router = useRouter();

  const [form, setForm] = useState(initialValues);

  const [isPending, startTransition] = useTransition();

  function updateField<T extends keyof typeof form>(
    field: T,
    value: (typeof form)[T]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await updateProfileSettings(form);

      if (!result.success) {
        toast.error(result.message ?? "We couldn't save your profile.");
        return;
      }

      toast.success(result.message ?? 'Profile updated.');
      router.refresh();
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

              <Input
                id="username"
                value={form.username}
                onChange={(event) =>
                  updateField('username', event.target.value.toLowerCase())
                }
                className="pl-7"
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

            <Input
              id="displayName"
              value={form.displayName}
              onChange={(event) =>
                updateField('displayName', event.target.value)
              }
              placeholder="Alex Johnson"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="label">
              Bio
            </label>

            <Textarea
              id="bio"
              value={form.bio}
              onChange={(event) => updateField('bio', event.target.value)}
              rows={5}
              maxLength={280}
              className="min-h-28"
              placeholder="A few words about your relationship with movies..."
            />

            <div className="mt-2 text-right text-[11px] text-muted-foreground">
              {form.bio.length}/280
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="h-10 px-5 hover:bg-primary-hover"
        >
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileSettingsForm;
