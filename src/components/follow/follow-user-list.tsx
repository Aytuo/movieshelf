'use client';

import {
  loadFollowersAction,
  loadFollowingAction,
} from '@/lib/actions/follow-list-action';
import type { FollowUser, FollowUserPage } from '@/types';
import { LoaderCircle, Users } from 'lucide-react';
import { useState } from 'react';
import { FollowUserListItem } from './follow-user-list-item';

type FollowUserListProps = {
  profileUserId: string;
  viewerUserId: string;
  mode: 'followers' | 'following';
  initialPage: FollowUserPage;
};

export function FollowUserList({
  profileUserId,
  viewerUserId,
  mode,
  initialPage,
}: FollowUserListProps) {
  const [users, setUsers] = useState<FollowUser[]>(initialPage.users);

  const [nextCursor, setNextCursor] = useState<string | null>(
    initialPage.nextCursor
  );

  const [hasMore, setHasMore] = useState(initialPage.hasMore);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  async function handleLoadMore() {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const page =
        mode === 'followers'
          ? await loadFollowersAction(profileUserId, nextCursor ?? undefined)
          : await loadFollowingAction(profileUserId, nextCursor ?? undefined);

      setUsers((current) => [...current, ...page.users]);

      setNextCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (users.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <Users className="mx-auto size-6 text-muted-foreground" />

        <h2 className="mt-4 font-heading text-lg font-semibold">
          No {mode} yet
        </h2>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {mode === 'followers'
            ? 'Nobody is following this profile yet.'
            : 'This user is not following anyone yet.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-border/50">
        {users.map((user) => (
          <FollowUserListItem
            key={user.userId}
            user={user}
            viewerUserId={viewerUserId}
          />
        ))}
      </div>

      {hasMore && (
        <div className="pt-4">
          <button
            type="button"
            onClick={() => void handleLoadMore()}
            disabled={isLoadingMore}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingMore && (
              <LoaderCircle className="size-3.5 animate-spin" />
            )}

            {isLoadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}
