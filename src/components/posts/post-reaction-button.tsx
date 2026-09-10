'use client';

import { togglePostReactionAction } from '@/lib/actions/post-reaction-action';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type PostReactionState = {
  count: number;
  reacted: boolean;
};

type PostReactionButtonProps = {
  postId: string;
  count: number;
  reacted: boolean;
};

export function PostReactionButton({
  postId,
  count: initialCount,
  reacted: initialReacted,
}: PostReactionButtonProps) {
  const [state, setState] = useState<PostReactionState>({
    count: initialCount,
    reacted: initialReacted,
  });

  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (pending) {
      return;
    }

    const previous = state;

    setState({
      count: previous.count + (previous.reacted ? -1 : 1),
      reacted: !previous.reacted,
    });

    setPending(true);

    try {
      const result = await togglePostReactionAction(postId);

      setState({
        count: result.count,
        reacted: result.reacted,
      });
    } catch (error) {
      console.error('Failed to toggle post reaction:', error);

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
      aria-busy={pending}
      aria-label={state.reacted ? 'Unlike post' : 'Like post'}
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
