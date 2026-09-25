'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth/client';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DeleteAccountSettings = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const canDelete =
    confirmation.trim().toUpperCase() === 'DELETE' && !isPending;

  function resetState() {
    setPassword('');
    setConfirmation('');
    setError(null);
  }

  async function deleteAccount() {
    if (!canDelete) {
      return;
    }

    setError(null);
    setIsPending(true);

    const result = password.trim()
      ? await authClient.deleteUser({
          password: password.trim(),
        })
      : await authClient.deleteUser();

    if (result.error) {
      setError(
        result.error.message ??
          "We couldn't delete your account. Please try again."
      );
      setIsPending(false);

      return;
    }

    setOpen(false);
    resetState();

    router.replace('/login');
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetState();
        }
      }}
    >
      <DialogTrigger className="mt-6 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5">
        Delete account
      </DialogTrigger>

      <DialogContent className="p-6 sm:max-w-md sm:p-7">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </div>

        <DialogHeader className="mt-5 space-y-3 text-center">
          <DialogTitle>Delete your account?</DialogTitle>

          <DialogDescription>
            <div className="space-y-4 text-sm leading-6 text-muted-foreground">
              <p>
                This permanently deletes your MovieShelf profile and all
                associated content.
              </p>

              <ul className="mx-auto max-w-xs space-y-2 text-left">
                <li className="flex gap-2.5">
                  <span className="w-3 shrink-0 text-center font-semibold text-muted-foreground">
                    -
                  </span>
                  <span>Reviews, posts, and activity history</span>
                </li>

                <li className="flex gap-2.5">
                  <span className="w-3 shrink-0 text-center font-semibold text-muted-foreground">
                    -
                  </span>
                  <span>Follows and notifications</span>
                </li>

                <li className="flex gap-2.5">
                  <span className="w-3 shrink-0 text-center font-semibold text-muted-foreground">
                    -
                  </span>
                  <span>Your account and profile data</span>
                </li>
              </ul>

              <p className="font-semibold text-foreground">
                This action cannot be undone.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="delete-password"
              className="mb-2 block text-sm font-medium"
            >
              Current password
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (if you use one)
              </span>
            </label>

            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(null);
              }}
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
            />

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              OAuth-only accounts can leave this empty when the current session
              is recent enough.
            </p>
          </div>

          <div className="space-y-4">
            <label
              htmlFor="delete-confirmation"
              className="mb-2 block text-sm font-medium"
            >
              Type <span className="font-semibold">DELETE</span> to confirm
            </label>

            <input
              id="delete-confirmation"
              value={confirmation}
              onChange={(event) => {
                setConfirmation(event.target.value);
                setError(null);
              }}
              className="input"
              placeholder="DELETE"
              autoComplete="off"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-7 gap-3 sm:gap-3">
          <DialogClose
            disabled={isPending}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </DialogClose>

          <button
            type="button"
            onClick={() => void deleteAccount()}
            disabled={!canDelete}
            className="rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete permanently'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountSettings;
