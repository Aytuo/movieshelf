'use client';

import {
  getPostReactionUsersAction,
  togglePostReactionAction,
} from '@/lib/actions/post-reaction-action';
import type { ReactionUser } from '@/types';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReactionUsersModal } from '../reactions/reaction-users-modal';

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
  const [listOpen, setListOpen] = useState(false);
  const [users, setUsers] = useState<ReactionUser[] | null>(null);
  const [listError, setListError] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!listOpen) {
      return;
    }

    let active = true;

    getPostReactionUsersAction(postId)
      .then((result) => {
        if (!active) {
          return;
        }

        setUsers(result);
        setListError(false);
      })
      .catch((error) => {
        console.error('Failed to load post reaction users:', error);

        if (!active) {
          return;
        }

        setUsers([]);
        setListError(true);
      });

    return () => {
      active = false;
    };
  }, [listOpen, postId]);

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

      toast.success(result.reacted ? 'Post liked.' : 'Like removed.');
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
    <>
      <div className="inline-flex items-center text-xs font-semibold text-muted-foreground">
        <button
          type="button"
          onClick={handleToggle}
          disabled={pending}
          aria-pressed={state.reacted}
          aria-busy={pending}
          aria-label={state.reacted ? 'Unlike post' : 'Like post'}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
        >
          <Heart
            className={`size-3.5 transition-transform ${
              pending ? 'scale-90' : 'scale-100'
            }`}
            fill={state.reacted ? 'currentColor' : 'none'}
          />

          <span>{state.reacted ? 'Liked' : 'Like'}</span>
        </button>

        {state.count > 0 ? (
          <button
            type="button"
            onClick={() => setListOpen(true)}
            className="ml-1 transition-colors hover:text-foreground hover:underline hover:underline-offset-2"
            aria-label={`View ${state.count} likes`}
          >
            {state.count}
          </button>
        ) : (
          <span className="ml-1">{state.count}</span>
        )}
      </div>

      <ReactionUsersModal
        key={listOpen ? 'open' : 'closed'}
        users={users}
        count={state.count}
        subject="post"
        open={listOpen}
        error={listError}
        onOpenChangeAction={setListOpen}
      />
    </>
  );
}
