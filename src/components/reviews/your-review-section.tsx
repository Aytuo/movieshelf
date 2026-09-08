'use client';

import type { MediaType } from '@/lib/media';
import type { ReviewInput } from '@/types';
import {
  CheckCircle2,
  ChevronDown,
  Edit3,
  Eye,
  EyeOff,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
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
  const [isFormOpen, setIsFormOpen] = useState(false);

  const initialValues: Partial<ReviewInput> = {
    title: review?.title ?? '',
    content: review?.content ?? '',
    rating: review?.rating ?? interactionRating ?? 8,
    containsSpoilers: review?.containsSpoilers ?? false,
  };

  function handleSuccess(values: ReviewInput) {
    const now = new Date();
    const isUpdate = review !== null;

    setReview((current) => ({
      id: current?.id ?? crypto.randomUUID(),
      title: values.title || null,
      content: values.content,
      rating: values.rating,
      containsSpoilers: values.containsSpoilers,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    }));

    setIsFormOpen(false);

    toast.success(
      isUpdate
        ? 'Your review has been updated.'
        : 'Your review has been published.'
    );

    router.refresh();
  }

  if (!isWatched) {
    return (
      <div className="rounded-2xl p-12 text-center surface">
        <div className="flex justify-center">
          <Eye className="size-6 text-muted-foreground" />
        </div>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">
          Once you&apos;ve marked this{' '}
          {type === 'movie' ? 'movie' : 'TV series'} as watched, you&apos;ll be
          able to rate it and write your review.
        </p>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <div className="rounded-2xl p-5 surface sm:p-7">
        <ReviewForm
          type={type}
          tmdbId={tmdbId}
          initialValues={initialValues}
          onSuccess={handleSuccess}
          onCancel={() => {
            setIsFormOpen(false);
          }}
        />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary-muted p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Share your take</p>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Put your thoughts into words and share them with the community.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Write a review
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <article className="overflow-hidden rounded-2xl border border-primary/15 bg-primary-muted">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute top-[-25%] right-[-5%] size-72 rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />

                  <p className="eyebrow">Your review</p>
                </div>

                {review.title && (
                  <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight">
                    {review.title}
                  </h3>
                )}
              </div>

              {review.rating !== null && (
                <div className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-rating">
                  <Star className="size-3.5 fill-current" />
                  {review.rating}/10
                </div>
              )}
            </div>

            {review.containsSpoilers ? (
              <details className="mt-6 rounded-xl border border-border/60 bg-background/40 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm text-muted-foreground [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <EyeOff className="size-3.5 shrink-0" />
                    <span>Contains spoilers — click to reveal</span>
                  </span>

                  <ChevronDown className="size-4 shrink-0 transition-transform duration-200 [[open]_&]:rotate-180" />
                </summary>

                <p className="mt-4 border-t border-border/60 pt-4 text-sm leading-7 whitespace-pre-line text-muted-foreground">
                  {review.content}
                </p>
              </details>
            ) : (
              <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-5">
                <p className="text-sm leading-7 whitespace-pre-line text-muted-foreground">
                  {review.content}
                </p>
              </div>
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
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-xs font-semibold transition-colors hover:bg-background/60"
              >
                <Edit3 className="size-3.5" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default YourReviewSection;
