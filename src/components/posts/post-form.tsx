'use client';

import { savePost } from '@/lib/actions/post-action';
import type { MediaType } from '@/lib/media';
import type { Post } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

type PostFormProps = {
  type: MediaType;
  tmdbId: number;
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
};

const PostForm = ({ type, tmdbId, onSuccess, onCancel }: PostFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const post = await savePost({
          type,
          tmdbId,
          title,
          content,
        });

        toast.success('Your post has been published.');
        router.refresh();
        onSuccess?.(post);
      } catch {
        toast.error("We couldn't publish your post. Please try again.");
      }
    });
  }

  const mediaLabel = type === 'movie' ? 'movie' : 'TV series';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="post-title" className="mb-2 block text-sm font-medium">
          Title
        </label>

        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="input"
          placeholder={`A thought about this ${mediaLabel}...`}
          maxLength={120}
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="post-content"
          className="mb-2 block text-sm font-medium"
        >
          Your post
        </label>

        <textarea
          id="post-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          maxLength={5000}
          disabled={isPending}
          className="min-h-32 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="What do you think?"
        />
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
          disabled={isPending}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Publishing...' : 'Publish post'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
