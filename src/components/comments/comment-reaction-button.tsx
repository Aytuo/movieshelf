'use client';

import { toggleCommentReactionAction } from '@/lib/actions/comment-reaction-action';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type CommentReactionState = {
  count: number;
  reacted: boolean;
};

type CommentReactionButtonProps = {
  commentId: string;
  postId: string;
  count: number;
  reacted: boolean;
};

export function CommentReactionButton({
  commentId,
  postId,
  count,
  reacted,
}: CommentReactionButtonProps) {
  const router = useRouter();

  const [state, setState] = useState<CommentReactionState>({
    count,
    reacted,
  });

  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (pending) {
      return;
    }

    const previous = state;

    const optimistic = {
      count: previous.count + (previous.reacted ? -1 : 1),
      reacted: !previous.reacted,
    };

    setState(optimistic);
    setPending(true);

    try {
      await toggleCommentReactionAction(commentId, postId);

      router.refresh();
    } catch (error) {
      console.error('Failed to toggle comment reaction:', error);

      setState(previous);

      toast.error("Couldn't update reaction", {
        description: 'Please try again.',
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={state.reacted}
      aria-label={state.reacted ? 'Unlike comment' : 'Like comment'}
      aria-busy={pending}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
    >
      <Heart
        className={`size-3.5 transition-transform ${
          pending ? 'scale-90' : 'scale-100'
        }`}
        fill={state.reacted ? 'currentColor' : 'none'}
      />

      <span>{state.reacted ? 'Liked' : 'Like'}</span>

      <span>{state.count}</span>
    </button>
  );
}
