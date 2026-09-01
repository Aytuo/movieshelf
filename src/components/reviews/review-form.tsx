'use client';

import { saveMediaReview } from '@/lib/actions/review-action';
import type { MediaType } from '@/lib/media';
import { reviewSchema, type ReviewInput } from '@/lib/validations/review';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

type ReviewFormProps = {
  type: MediaType;
  tmdbId: number;
  initialValues?: Partial<ReviewInput>;
};

const ReviewForm = ({ type, tmdbId, initialValues }: ReviewFormProps) => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);

  const form = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: initialValues?.title ?? '',
      content: initialValues?.content ?? '',
      rating: initialValues?.rating ?? 8,
      containsSpoilers: initialValues?.containsSpoilers ?? false,
    },
  });

  function onSubmit(values: ReviewInput) {
    setError(null);

    startTransition(async () => {
      try {
        await saveMediaReview(type, tmdbId, values);

        form.reset(values);
      } catch {
        setError("We couldn't save your review. Please try again.");
      }
    });
  }

  const mediaLabel = type === 'movie' ? 'movie' : 'TV series';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="review-title"
          className="mb-2 block text-sm font-medium"
        >
          Title
        </label>

        <input
          id="review-title"
          {...form.register('title')}
          className="input"
          placeholder={`A few words about this ${mediaLabel}...`}
        />

        {form.formState.errors.title && (
          <p className="mt-2 text-xs text-destructive">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="review-content"
          className="mb-2 block text-sm font-medium"
        >
          Your review
        </label>

        <textarea
          id="review-content"
          {...form.register('content')}
          rows={6}
          className="min-h-36 w-full resize-y rounded-lg border border-border bg-surface px-3 py-3 text-sm transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="What did you think?"
        />

        {form.formState.errors.content && (
          <p className="mt-2 text-xs text-destructive">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div>
        <p className="text-sm font-medium">Your rating</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                form.setValue('rating', value, {
                  shouldValidate: true,
                })
              }
              className={[
                'flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors',
                form.watch('rating') === value
                  ? 'border-rating/40 bg-rating-muted text-rating'
                  : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover',
              ].join(' ')}
            >
              {value}
            </button>
          ))}
        </div>

        {form.formState.errors.rating && (
          <p className="mt-2 text-xs text-destructive">
            {form.formState.errors.rating.message}
          </p>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          {...form.register('containsSpoilers')}
          className="size-4 rounded border-border accent-primary"
        />
        Contains spoilers
      </label>

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
        {isPending ? 'Saving...' : 'Publish review'}
      </button>
    </form>
  );
};

export default ReviewForm;
