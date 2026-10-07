'use client';

import type { Comment } from '@/types';
import { MessageCirclePlus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
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
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setIsOpen(true)}
          className="h-10 border-border bg-surface px-4 hover:bg-surface-hover"
        >
          <MessageCirclePlus className="size-4" />
          Join the conversation
        </Button>
      ) : (
        <div className="rounded-2xl p-5 surface sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Join the conversation</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Share your thoughts with other viewers.
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="size-8 rounded-lg text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              aria-label="Close comment form"
            >
              <X className="size-4" />
            </Button>
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
