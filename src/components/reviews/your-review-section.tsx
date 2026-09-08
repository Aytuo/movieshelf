'use client';

import type { MediaType } from '@/lib/media';
import type { ReviewInput } from '@/types';
import { CheckCircle2, Edit3, EyeOff, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReviewForm from './review-form';

type ReviewData = {
  id: string;
  title: string | null;
  content: string;
  rating: number | null;
  containsSpoilers: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type YourReviewSectionProps = {
  type: MediaType;
  tmdbId: number;
  isWatched: boolean;
  existingReview: ReviewData | null;
  interactionRating: number | null;
};

const YourReviewSection = ({
  type,
  tmdbId,
  isWatched,
  existingReview,
  interactionRating,
}: YourReviewSectionProps) => {
  const router = useRouter();

  const [review, setReview] = useState<ReviewData | null>(existingReview);
  const [isEditing, setIsEditing] = useState(existingReview === null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initialValues: Partial<ReviewInput> = {
    title: review?.title ?? '',
    content: review?.content ?? '',
    rating: review?.rating ?? interactionRating ?? 8,
    containsSpoilers: review?.containsSpoilers ?? false,
  };

  function handleSuccess(values: ReviewInput) {
    const now = new Date();

    setReview((current) => ({
      id: current?.id ?? crypto.randomUUID(),
      title: values.title || null,
      content: values.content,
      rating: values.rating,
      containsSpoilers: values.containsSpoilers,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    }));

    setIsEditing(false);
    setSuccessMessage(
      review
        ? 'Your review has been updated.'
        : 'Your review has been published.'
    );

    router.refresh();
  }

  if (!isWatched) {
    return (
      <div className="rounded-2xl p-12 text-center surface">
        <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
          Once you&apos;ve marked this{' '}
          {type === 'movie' ? 'movie' : 'TV series'} as watched, you&apos;ll be
          able to rate it and write your review.
        </p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ReviewForm
        type={type}
        tmdbId={tmdbId}
        initialValues={initialValues}
        onSuccess={handleSuccess}
        onCancel={() => {
          setSuccessMessage(null);
          setIsEditing(false);
        }}
      />
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 text-primary" />
          <span>{successMessage}</span>
        </div>
      )}

      <article className="rounded-2xl p-5 surface">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Your review
            </p>

            {review.title && (
              <h3 className="mt-3 font-heading text-xl font-semibold">
                {review.title}
              </h3>
            )}
          </div>

          {review.rating !== null && (
            <div className="inline-flex items-center gap-1 text-sm font-semibold text-rating">
              <Star className="size-3.5 fill-current" />
              {review.rating}/10
            </div>
          )}
        </div>

        {review.containsSpoilers ? (
          <details className="mt-5">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <EyeOff className="size-3.5" />
                Contains spoilers — reveal review
              </span>
            </summary>

            <p className="mt-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
              {review.content}
            </p>
          </details>
        ) : (
          <p className="mt-5 text-sm leading-7 whitespace-pre-line text-muted-foreground">
            {review.content}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {review.updatedAt.getTime() !== review.createdAt.getTime()
              ? `Updated ${review.updatedAt.toLocaleDateString()}`
              : review.createdAt.toLocaleDateString()}
          </p>

          <button
            type="button"
            onClick={() => {
              setSuccessMessage(null);
              setIsEditing(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition-colors hover:bg-surface-hover"
          >
            <Edit3 className="size-3.5" />
            Edit
          </button>
        </div>
      </article>
    </div>
  );
};

export default YourReviewSection;
