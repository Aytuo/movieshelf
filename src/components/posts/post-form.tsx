'use client';

import { savePost } from '@/lib/actions/post-action';
import type { MediaType } from '@/lib/media';
import { useState, useTransition } from 'react';

type PostFormProps = {
  type: MediaType;
  tmdbId: number;
};

const PostForm = ({ type, tmdbId }: PostFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);

    startTransition(async () => {
      try {
        await savePost({
          type,
          tmdbId,
          title,
          content,
        });

        setTitle('');
        setContent('');
      } catch {
        setError("We couldn't publish your post. Please try again.");
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

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Publishing...' : 'Publish post'}
      </button>
    </form>
  );
};

export default PostForm;
