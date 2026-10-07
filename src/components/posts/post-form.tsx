'use client';

import { savePost } from '@/lib/actions/post-action';
import type { MediaType } from '@/lib/media';
import { postSchema } from '@/lib/validations/post';
import type { Post } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type PostFormProps = {
  type: MediaType;
  tmdbId: number;
  onSuccess?: (post: Post) => void;
  onCancel?: () => void;
};

type PostFormErrors = {
  title?: string;
  content?: string;
};

const PostForm = ({ type, tmdbId, onSuccess, onCancel }: PostFormProps) => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<PostFormErrors>({});

  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = postSchema.safeParse({
      type,
      tmdbId,
      title,
      content,
    });

    if (!parsed.success) {
      const nextErrors: PostFormErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (field === 'title' || field === 'content') {
          nextErrors[field] ??= issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        const post = await savePost(parsed.data);

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

        <Input
          id="post-title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);

            if (errors.title) {
              setErrors((current) => ({
                ...current,
                title: undefined,
              }));
            }
          }}
          placeholder={`A thought about this ${mediaLabel}...`}
          maxLength={120}
          disabled={isPending}
          aria-invalid={Boolean(errors.title)}
        />

        {errors.title && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="post-content"
          className="mb-2 block text-sm font-medium"
        >
          Your post
        </label>

        <Textarea
          id="post-content"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);

            if (errors.content) {
              setErrors((current) => ({
                ...current,
                content: undefined,
              }));
            }
          }}
          rows={5}
          maxLength={5000}
          disabled={isPending}
          placeholder="What do you think?"
          aria-invalid={Boolean(errors.content)}
        />

        {errors.content && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.content}
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

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? 'Publishing...' : 'Publish post'}
        </Button>
      </div>
    </form>
  );
};

export default PostForm;
