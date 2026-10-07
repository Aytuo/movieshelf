'use client';

import {
  followUserAction,
  unfollowUserAction,
} from '@/lib/actions/follow-action';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

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
    <Button
      type="button"
      onClick={() => void handleClick()}
      disabled={isPending || isLoading}
      aria-pressed={isFollowing}
      size="lg"
      variant={isFollowing ? 'outline' : 'default'}
      className={
        isFollowing
          ? 'min-w-24 border-border bg-surface hover:bg-surface-hover'
          : 'min-w-24 border-primary bg-primary text-primary-foreground hover:bg-primary-hover'
      }
    >
      {isLoading || isPending
        ? 'Saving…'
        : isFollowing
          ? 'Following'
          : 'Follow'}
    </Button>
  );
}
