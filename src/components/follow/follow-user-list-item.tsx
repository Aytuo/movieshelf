'use client';

import type { FollowUser } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './follow-button';

type FollowUserListItemProps = {
  user: FollowUser;
  viewerUserId: string;
};

export function FollowUserListItem({
  user,
  viewerUserId,
}: FollowUserListItemProps) {
  const label = user.displayName || `@${user.username}`;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link
        href={`/profile/${user.username}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-hover text-sm font-semibold">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="size-10 object-cover"
            />
          ) : (
            user.username.slice(0, 1).toUpperCase()
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold transition-colors hover:text-primary">
            {label}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            @{user.username}
          </p>
        </div>
      </Link>

      {user.userId !== viewerUserId && (
        <FollowButton
          followingId={user.userId}
          initialFollowing={user.viewerIsFollowing}
        />
      )}
    </div>
  );
}
