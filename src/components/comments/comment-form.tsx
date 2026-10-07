'use client';

import { saveComment } from '@/lib/actions/comment-action';
import type { Comment } from '@/types';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

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
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const trimmedContent = content.trim();

        if (!trimmedContent) {
          setValidationError('Comment cannot be empty.');
          return;
        }

        setValidationError(null);

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

        <Textarea
          id={textareaId}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);

            if (validationError) {
              setValidationError(null);
            }
          }}
          rows={3}
          maxLength={2000}
          disabled={isPending}
          placeholder={
            parentId ? 'Write a reply...' : 'Join the conversation...'
          }
          aria-invalid={Boolean(validationError)}
        />

        <div className="mt-2 flex justify-end">
          <span className="text-xs text-muted-foreground">
            {content.length}/2000
          </span>
        </div>

        {validationError && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {validationError}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" size="lg" disabled={isPending || !content.trim()}>
          {isPending
            ? parentId
              ? 'Replying...'
              : 'Commenting...'
            : parentId
              ? 'Reply'
              : 'Post comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
