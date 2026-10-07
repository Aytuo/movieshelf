'use client';

import {
  followUserAction,
  unfollowUserAction,
} from '@/lib/actions/follow-action';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

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

    const wasFollowing = isFollowing;

    try {
      const changed = wasFollowing
        ? await unfollowUserAction(followingId)
        : await followUserAction(followingId);

      if (!changed) {
        toast.error(
          wasFollowing
            ? "Couldn't unfollow this user. Please try again."
            : "Couldn't follow this user. Please try again."
        );

        return;
      }

      setIsFollowing(!wasFollowing);

      toast.success(wasFollowing ? 'Unfollowed user.' : 'Now following user.');

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't update follow status. Please try again."
      );
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
      className={cn(
        'inline-flex min-w-24 items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
        isFollowing
          ? 'border-border bg-surface text-foreground hover:bg-surface-hover'
          : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
        'disabled:cursor-not-allowed disabled:opacity-60'
      )}
    >
      {isLoading || isPending
        ? 'Saving…'
        : isFollowing
          ? 'Following'
          : 'Follow'}
    </button>
  );
}
