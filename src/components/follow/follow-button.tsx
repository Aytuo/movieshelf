'use client';

import {
  followUserAction,
  unfollowUserAction,
} from '@/lib/actions/follow-action';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

type FollowButtonProps = {
  followingId: string;
  initialFollowing: boolean;
};

export function FollowButton({
  followingId,
  initialFollowing,
}: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (isPending || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const changed = isFollowing
        ? await unfollowUserAction(followingId)
        : await followUserAction(followingId);

      if (!changed) {
        return;
      }

      setIsFollowing(!isFollowing);

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isPending || isLoading}
      aria-pressed={isFollowing}
      className={[
        'inline-flex min-w-24 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
        isFollowing
          ? 'border-border bg-surface text-foreground hover:bg-surface-hover'
          : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:cursor-not-allowed disabled:opacity-60',
      ].join(' ')}
    >
      {isLoading || isPending
        ? 'Saving…'
        : isFollowing
          ? 'Following'
          : 'Follow'}
    </button>
  );
}
