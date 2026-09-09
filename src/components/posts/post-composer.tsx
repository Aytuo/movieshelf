'use client';

import type { MediaType } from '@/lib/media';
import type { Post } from '@/types';
import { MessageSquarePlus, X } from 'lucide-react';
import { useState } from 'react';
import PostForm from './post-form';

type PostComposerProps = {
  type: MediaType;
  tmdbId: number;
  onSuccess?: (post: Post) => void;
};

const PostComposer = ({ type, tmdbId, onSuccess }: PostComposerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleSuccess(post: Post) {
    setIsOpen(false);
    onSuccess?.(post);
  }

  function handleCancel() {
    setIsOpen(false);
  }

  return (
    <div className="mb-8">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover"
        >
          <MessageSquarePlus className="size-4" />
          Write a post
        </button>
      ) : (
        <div className="rounded-2xl p-5 surface sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Create a post</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Share your thoughts with the community.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
              aria-label="Close post form"
            >
              <X className="size-4" />
            </button>
          </div>

          <PostForm
            type={type}
            tmdbId={tmdbId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
};

export default PostComposer;
