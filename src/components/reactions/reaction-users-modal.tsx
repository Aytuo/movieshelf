'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { ReactionUser } from '@/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

type ReactionUsersModalProps = {
  users: ReactionUser[] | null;
  count: number;
  subject: 'post' | 'comment';
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  error?: boolean;
};

export function ReactionUsersModal({
  users,
  count,
  subject,
  open,
  onOpenChangeAction,
  error = false,
}: ReactionUsersModalProps) {
  const subjectLabel = subject === 'post' ? 'post' : 'comment';

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] max-w-none flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 text-left">
          <DialogTitle className="font-heading text-lg">Liked by</DialogTitle>

          <DialogDescription className="text-xs leading-5">
            {count} {count === 1 ? 'person likes' : 'people like'} this{' '}
            {subjectLabel}.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 overflow-y-auto px-4 py-2 sm:px-5">
          {users === null ? (
            <div className="flex min-h-32 items-center justify-center">
              <Loader2
                className="size-5 animate-spin text-muted-foreground"
                aria-label="Loading likes"
              />
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Couldn&apos;t load likes.
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No likes yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {users.map((user) => {
                const label = user.displayName || `@${user.username}`;

                return (
                  <Link
                    key={user.userId}
                    href={`/profile/${user.username}`}
                    onClick={() => onOpenChangeAction(false)}
                    className="flex items-center gap-3 py-3 transition-colors hover:text-primary"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-hover text-xs font-semibold">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.username.slice(0, 1).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{label}</p>

                      <p className="truncate text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
