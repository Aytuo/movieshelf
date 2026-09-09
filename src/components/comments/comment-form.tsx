'use client';

import { saveComment } from '@/lib/actions/comment-action';
import type { Comment } from '@/types';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

type CommentFormProps = {
  postId: string;
  parentId?: string | null;
  onSuccess?: (comment: Comment) => void;
  onCancel?: () => void;
};

const CommentForm = ({
  postId,
  parentId = null,
  onSuccess,
  onCancel,
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const trimmedContent = content.trim();

        if (!trimmedContent) {
          return;
        }

        const comment = await saveComment({
          postId,
          parentId,
          content: trimmedContent,
        });

        toast.success(
          parentId
            ? 'Your reply has been added.'
            : 'Your comment has been added.'
        );

        setContent('');
        onSuccess?.(comment);
      } catch {
        toast.error(
          parentId
            ? "We couldn't add your reply. Please try again."
            : "We couldn't add your comment. Please try again."
        );
      }
    });
  }

  const textareaId = parentId ? `reply-content-${parentId}` : 'comment-content';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={textareaId} className="mb-2 block text-sm font-medium">
          {parentId ? 'Your reply' : 'Your comment'}
        </label>

        <textarea
          id={textareaId}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          maxLength={2000}
          disabled={isPending}
          className="min-h-24 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder={
            parentId ? 'Write a reply...' : 'Join the conversation...'
          }
        />

        <div className="mt-2 flex justify-end">
          <span className="text-xs text-muted-foreground">
            {content.length}/2000
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? parentId
              ? 'Replying...'
              : 'Commenting...'
            : parentId
              ? 'Reply'
              : 'Post comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
