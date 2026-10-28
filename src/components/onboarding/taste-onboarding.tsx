'use client';

import {
  finishTasteOnboarding,
  saveTasteRatings,
  skipTasteOnboarding,
} from '@/lib/actions/onboarding-action';
import type { Media } from '@/lib/media';
import type { MediaSearchResult } from '@/types';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import OnboardingCompleteStep from './onboarding-complete-step';
import RatingStep from './rating-step';
import SelectionStep from './selection-step';

type TasteOnboardingProps = {
  movieResult: MediaSearchResult;
  tvResult: MediaSearchResult;
};

type OnboardingType = 'movie' | 'tv';
type Step = 'selection' | 'rating' | 'complete';

const MIN_SELECTIONS = 5;
const MAX_SELECTIONS = 10;
const DEFAULT_RATING = 8;

const TasteOnboarding = ({ movieResult, tvResult }: TasteOnboardingProps) => {
  const router = useRouter();

  const [type, setType] = useState<OnboardingType>('movie');
  const [step, setStep] = useState<Step>('selection');
  const [movieSelectedMedia, setMovieSelectedMedia] = useState<Media[]>([]);
  const [tvSelectedMedia, setTvSelectedMedia] = useState<Media[]>([]);
  const [movieRatings, setMovieRatings] = useState<Record<number, number>>({});
  const [tvRatings, setTvRatings] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const initialResult = type === 'movie' ? movieResult : tvResult;
  const media = initialResult.media;

  const selectedMedia = type === 'movie' ? movieSelectedMedia : tvSelectedMedia;

  const selectedIds = selectedMedia.map((item) => item.tmdbId);

  const ratings = type === 'movie' ? movieRatings : tvRatings;

  function toggleMedia(mediaItem: Media) {
    const updateSelection = (current: Media[]) => {
      const alreadySelected = current.some(
        (item) => item.tmdbId === mediaItem.tmdbId
      );

      if (alreadySelected) {
        return current.filter((item) => item.tmdbId !== mediaItem.tmdbId);
      }

      if (current.length >= MAX_SELECTIONS) {
        return current;
      }

      return [...current, mediaItem];
    };

    setError(null);

    if (type === 'movie') {
      setMovieSelectedMedia(updateSelection);
    } else {
      setTvSelectedMedia(updateSelection);
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

        setStep('complete');
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

  function enterApp() {
    setError(null);

    startTransition(async () => {
      try {
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

  if (step === 'selection') {
    return (
      <SelectionStep
        key={type}
        initialResult={initialResult}
        type={type}
        selectedMedia={selectedMedia}
        selectedIds={selectedIds}
        onToggle={toggleMedia}
        onContinue={beginRatings}
        onSkip={skip}
        error={error}
        isPending={isPending}
      />
    );
  }

  if (step === 'complete') {
    return (
      <OnboardingCompleteStep
        onEnter={enterApp}
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
