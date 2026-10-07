'use client';

import {
  getCommentReactionUsersAction,
  toggleCommentReactionAction,
} from '@/lib/actions/comment-reaction-action';
import type { ReactionUser } from '@/types';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ReactionUsersModal } from '../reactions/reaction-users-modal';

type CommentReactionState = {
  count: number;
  reacted: boolean;
};

type CommentReactionButtonProps = {
  commentId: string;
  count: number;
  reacted: boolean;
};

export function CommentReactionButton({
  commentId,
  count: initialCount,
  reacted: initialReacted,
}: CommentReactionButtonProps) {
  const [state, setState] = useState<CommentReactionState>({
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

    getCommentReactionUsersAction(commentId)
      .then((result) => {
        if (!active) {
          return;
        }

        setUsers(result);
        setListError(false);
      })
      .catch((error) => {
        console.error('Failed to load comment reaction users:', error);

        if (!active) {
          return;
        }

        setUsers([]);
        setListError(true);
      });

    return () => {
      active = false;
    };
  }, [listOpen, commentId]);

  function handleOpenList() {
    setUsers(null);
    setListError(false);
    setListOpen(true);
  }

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
      const result = await toggleCommentReactionAction(commentId);

      setState({
        count: result.count,
        reacted: result.reacted,
      });

      toast.success(result.reacted ? 'Comment liked.' : 'Like removed.');
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
    <>
      <div className="inline-flex items-center text-xs font-semibold text-muted-foreground">
        <button
          type="button"
          onClick={handleToggle}
          disabled={pending}
          aria-pressed={state.reacted}
          aria-label={state.reacted ? 'Unlike comment' : 'Like comment'}
          aria-busy={pending}
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
            onClick={handleOpenList}
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
        users={users}
        count={state.count}
        subject="comment"
        open={listOpen}
        error={listError}
        onOpenChangeAction={setListOpen}
      />
    </>
  );
}
