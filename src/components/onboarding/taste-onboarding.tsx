'use client';

import {
  finishTasteOnboarding,
  saveTasteRatings,
  skipTasteOnboarding,
} from '@/lib/actions/onboarding-action';
import type { Media } from '@/lib/media';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import RatingStep from './rating-step';
import SelectionStep from './selection-step';

type TasteOnboardingProps = {
  movieMedia: Media[];
  tvMedia: Media[];
};

type OnboardingType = 'movie' | 'tv';
type Step = 'selection' | 'rating';

const MIN_SELECTIONS = 5;
const MAX_SELECTIONS = 10;
const DEFAULT_RATING = 8;

const TasteOnboarding = ({ movieMedia, tvMedia }: TasteOnboardingProps) => {
  const router = useRouter();

  const [type, setType] = useState<OnboardingType>('movie');
  const [step, setStep] = useState<Step>('selection');
  const [movieSelectedIds, setMovieSelectedIds] = useState<number[]>([]);
  const [tvSelectedIds, setTvSelectedIds] = useState<number[]>([]);
  const [movieRatings, setMovieRatings] = useState<Record<number, number>>({});
  const [tvRatings, setTvRatings] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const media = type === 'movie' ? movieMedia : tvMedia;

  const selectedIds = type === 'movie' ? movieSelectedIds : tvSelectedIds;

  const ratings = type === 'movie' ? movieRatings : tvRatings;

  const selectedMedia = useMemo(
    () => media.filter((item) => selectedIds.includes(item.tmdbId)),
    [media, selectedIds]
  );

  function setSelectedIds(
    update: number[] | ((current: number[]) => number[])
  ) {
    if (type === 'movie') {
      setMovieSelectedIds(update);
    } else {
      setTvSelectedIds(update);
    }
  }

  function setCurrentRatings(
    update:
      | Record<number, number>
      | ((current: Record<number, number>) => Record<number, number>)
  ) {
    if (type === 'movie') {
      setMovieRatings(update);
    } else {
      setTvRatings(update);
    }
  }

  function toggleMedia(tmdbId: number) {
    setSelectedIds((current) => {
      if (current.includes(tmdbId)) {
        return current.filter((id) => id !== tmdbId);
      }

      if (current.length >= MAX_SELECTIONS) {
        return current;
      }

      return [...current, tmdbId];
    });
  }

  function beginRatings() {
    setError(null);

    if (selectedIds.length < MIN_SELECTIONS) {
      setError(
        `Choose at least ${MIN_SELECTIONS} ${
          type === 'movie' ? 'movies' : 'TV series'
        } to continue.`
      );

      return;
    }

    setCurrentRatings(
      Object.fromEntries(selectedIds.map((tmdbId) => [tmdbId, DEFAULT_RATING]))
    );

    setStep('rating');
  }

  function goBack() {
    setError(null);
    setStep('selection');
  }

  function updateRating(tmdbId: number, rating: number) {
    setCurrentRatings((current) => ({
      ...current,
      [tmdbId]: rating,
    }));
  }

  function completeCurrentType() {
    setError(null);

    const payload = {
      ratings: selectedIds.map((tmdbId) => ({
        tmdbId,
        type,
        rating: ratings[tmdbId] ?? DEFAULT_RATING,
      })),
    };

    startTransition(async () => {
      try {
        await saveTasteRatings(payload);

        if (type === 'movie') {
          setType('tv');
          setStep('selection');
          setError(null);

          return;
        }

        await finishTasteOnboarding();

        router.replace('/home');
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.'
        );
      }
    });
  }

  function skip() {
    startTransition(async () => {
      try {
        await skipTasteOnboarding();

        router.replace('/home');
        router.refresh();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.'
        );
      }
    });
  }

  if (step === 'selection') {
    return (
      <SelectionStep
        media={media}
        type={type}
        selectedIds={selectedIds}
        onToggle={toggleMedia}
        onContinue={beginRatings}
        onSkip={skip}
        error={error}
        isPending={isPending}
      />
    );
  }

  return (
    <RatingStep
      media={selectedMedia}
      type={type}
      ratings={ratings}
      onRating={updateRating}
      onBack={goBack}
      onComplete={completeCurrentType}
      error={error}
      isPending={isPending}
    />
  );
};

export default TasteOnboarding;
