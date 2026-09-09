'use client';

import type { Comment } from '@/types';
import { MessageCirclePlus, X } from 'lucide-react';
import { useState } from 'react';
import CommentForm from './comment-form';

type CommentComposerProps = {
  postId: string;
  onSuccess?: (comment: Comment) => void;
};

const CommentComposer = ({ postId, onSuccess }: CommentComposerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccess(comment: Comment) {
    setIsOpen(false);
    onSuccess?.(comment);
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover"
        >
          <MessageCirclePlus className="size-4" />
          Join the conversation
        </button>
      ) : (
        <div className="rounded-2xl p-5 surface sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Join the conversation</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Share your thoughts with other viewers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Close comment form"
            >
              <X className="size-4" />
            </button>
          </div>

          <CommentForm
            postId={postId}
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentComposer;
