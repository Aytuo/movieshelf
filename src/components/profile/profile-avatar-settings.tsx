'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { setAvatarSourceAction } from '@/lib/actions/profile-avatar-action';
import { cn } from '@/lib/utils';
import { Check, ImagePlus, Upload, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type AvatarSource = 'default' | 'upload' | 'oauth';
type AvatarProvider = 'google' | 'discord';

type OAuthAvatarOption = {
  provider: AvatarProvider;
  label: string;
  displayName: string | null;
  identifier: string | null;
  image: string | null;
};

type ProfileAvatarSettingsProps = {
  username: string;
  initialSource: AvatarSource;
  initialProvider: AvatarProvider | null;
  initialAvatarUrl: string | null;
  fallbackAvatarUrl: string | null;
  fallbackAvatarProvider: AvatarProvider | null;
  oauthAccounts: OAuthAvatarOption[];
};

const providerLabels: Record<AvatarProvider, string> = {
  google: 'Google',
  discord: 'Discord',
};

function AvatarPreview({
  url,
  initial,
  size = 'size-20',
}: {
  url: string | null;
  initial: string;
  size?: string;
}) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-hover text-2xl font-bold text-muted-foreground`}
      role="img"
      aria-label="Profile avatar"
    >
      {url ? (
        <div
          className="size-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${url}")` }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

const ProfileAvatarSettings = ({
  username,
  initialSource,
  initialProvider,
  initialAvatarUrl,
  fallbackAvatarUrl,
  fallbackAvatarProvider,
  oauthAccounts,
}: ProfileAvatarSettingsProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<AvatarSource>(initialSource);
  const [provider, setProvider] = useState<AvatarProvider | null>(
    initialProvider ?? fallbackAvatarProvider
  );
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);

  const [mode, setMode] = useState<'default' | 'upload' | 'oauth'>(
    initialSource === 'oauth'
      ? 'oauth'
      : initialSource === 'upload'
        ? 'upload'
        : 'default'
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial = username.slice(0, 1).toUpperCase();

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function openDialog() {
    setMode(
      source === 'oauth' ? 'oauth' : source === 'upload' ? 'upload' : 'default'
    );
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setOpen(true);
  }

  function closeDialog(nextOpen: boolean) {
    if (!pending) {
      setOpen(nextOpen);

      if (!nextOpen) {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
      }
    }
  }

  function selectFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setError(null);

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Use JPG, PNG or WebP.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('The image cannot exceed 3 MB.');
      return;
    }

    if (previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function selectDefault() {
    setError(null);
    setPending(true);

    const result = await setAvatarSourceAction('default');

    if (!result.success) {
      setError(result.message ?? "Couldn't update your avatar.");
      setPending(false);
      return;
    }

    setSource('default');
    setProvider(null);
    setAvatarUrl(null);
    setPending(false);
    setOpen(false);
    router.refresh();
  }

  async function selectOAuth(nextProvider: AvatarProvider) {
    setError(null);
    setPending(true);

    const result = await setAvatarSourceAction('oauth', nextProvider);

    if (!result.success) {
      setError(result.message ?? "Couldn't use this avatar.");
      setPending(false);
      return;
    }

    setSource('oauth');
    setProvider(nextProvider);
    setAvatarUrl(result.avatarUrl ?? null);
    setPending(false);
    setOpen(false);
    router.refresh();
  }

  async function uploadAvatar() {
    if (!selectedFile) {
      setError('Choose an image first.');
      return;
    }

    setError(null);
    setPending(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const response = await fetch('/api/profile/avatar', {
      method: 'POST',
      body: formData,
    });

    const result = (await response.json()) as {
      success?: boolean;
      url?: string;
      message?: string;
    };

    if (!response.ok || !result.success || !result.url) {
      setError(result.message ?? "Couldn't upload your avatar.");
      setPending(false);
      return;
    }

    setSource('upload');
    setProvider(null);
    setAvatarUrl(result.url);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPending(false);
    setOpen(false);
    router.refresh();
  }

  const currentDisplayUrl = previewUrl ?? avatarUrl;

  const displayedAvatarUrl = avatarUrl ?? fallbackAvatarUrl;

  const currentLabel = displayedAvatarUrl
    ? source === 'upload'
      ? 'Uploaded image'
      : source === 'oauth'
        ? provider
          ? `${providerLabels[provider]} avatar`
          : 'Connected account avatar'
        : fallbackAvatarProvider
          ? `Connected account avatar (${providerLabels[fallbackAvatarProvider]})`
          : 'Default avatar'
    : 'Default avatar';

  return (
    <>
      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <AvatarPreview url={displayedAvatarUrl} initial={initial} />

          <div className="min-w-0">
            <h3 className="text-sm font-semibold">Profile image</h3>

            <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">
              Choose a default avatar, upload your own image, or use an avatar
              from a connected account.
            </p>

            <button
              type="button"
              onClick={openDialog}
              className="mt-4 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover"
            >
              Change avatar
            </button>

            <p className="mt-3 text-xs text-muted-foreground">
              Current: <span className="text-foreground">{currentLabel}</span>
            </p>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={closeDialog}>
        <DialogContent className="p-6 sm:max-w-lg sm:p-7">
          <DialogHeader>
            <DialogTitle>Choose your avatar</DialogTitle>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-surface-hover p-1">
            {[
              ['default', 'Default'],
              ['upload', 'Upload'],
              ['oauth', 'Connected'] as const,
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value as typeof mode)}
                className={cn(
                  'rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  mode === value
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {mode === 'default' && (
              <div className="flex flex-col items-center py-4 text-center">
                <AvatarPreview url={null} initial={initial} size="size-24" />

                <h3 className="mt-4 text-sm font-semibold">
                  Use your username initial
                </h3>

                <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                  A clean default avatar based on your current username.
                </p>

                <button
                  type="button"
                  onClick={() => void selectDefault()}
                  disabled={pending && mode === 'default'}
                  className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? 'Saving...' : 'Use default avatar'}
                </button>
              </div>
            )}

            {mode === 'upload' && (
              <div className="space-y-5">
                <label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-border px-6 py-8 text-center transition-colors hover:bg-surface-hover">
                  {currentDisplayUrl ? (
                    <AvatarPreview
                      url={currentDisplayUrl}
                      initial={initial}
                      size="size-24"
                    />
                  ) : (
                    <div className="flex size-24 items-center justify-center rounded-2xl border border-border bg-surface-hover">
                      <ImagePlus className="size-7 text-muted-foreground" />
                    </div>
                  )}

                  <span className="mt-4 text-sm font-semibold">
                    {selectedFile ? selectedFile.name : 'Choose an image'}
                  </span>

                  <span className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or WebP
                  </span>

                  <span className="text-xs text-muted-foreground/70">
                    Maximum file size: 3 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(event) => selectFile(event.target.files?.[0])}
                    disabled={pending}
                  />
                </label>

                {selectedFile && (
                  <button
                    type="button"
                    onClick={() => void uploadAvatar()}
                    disabled={pending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="size-4" />
                    {pending ? 'Uploading...' : 'Upload image'}
                  </button>
                )}
              </div>
            )}

            {mode === 'oauth' && (
              <div className="space-y-3">
                {oauthAccounts.length > 0 ? (
                  oauthAccounts.map((account) => (
                    <button
                      key={account.provider}
                      type="button"
                      onClick={() => void selectOAuth(account.provider)}
                      disabled={pending}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                        provider === account.provider
                          ? 'border-primary bg-primary-muted'
                          : 'border-border hover:bg-surface-hover'
                      )}
                    >
                      <div
                        className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-hover"
                        role="img"
                        aria-label={`${account.label} avatar`}
                      >
                        {account.image ? (
                          <div
                            className="size-full bg-cover bg-center"
                            style={{
                              backgroundImage: `url("${account.image}")`,
                            }}
                          />
                        ) : (
                          <UserRound className="size-5 text-muted-foreground" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{account.label}</p>

                        {account.displayName && (
                          <p className="truncate text-sm text-foreground">
                            {account.displayName}
                          </p>
                        )}

                        {account.identifier && (
                          <p className="truncate text-xs text-muted-foreground">
                            {account.identifier}
                          </p>
                        )}
                      </div>

                      {provider === account.provider && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-border p-5 text-center">
                    <p className="text-sm font-medium">No connected accounts</p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Connect Google or Discord in Connected accounts first.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <DialogFooter className="mt-7">
            <DialogClose
              disabled={pending}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileAvatarSettings;
