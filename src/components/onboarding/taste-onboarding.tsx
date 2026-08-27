'use client';

import {
  completeTasteOnboarding,
  skipTasteOnboarding,
} from '@/lib/actions/onboarding.action';
import { Media } from '@/lib/media';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import RatingStep from './rating-step';
import SelectionStep from './selection-step';

type TasteOnboardingProps = {
  movies: Media[];
};

type Step = 'selection' | 'rating';

const TasteOnboarding = ({ movies }: TasteOnboardingProps) => {
  const router = useRouter();
  const [step, setStep] = useState<Step>('selection');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedMovies = useMemo(
    () => movies.filter((movie) => selectedIds.includes(movie.tmdbId)),
    [movies, selectedIds]
  );

  function toggleMovie(movieId: number) {
    setSelectedIds((current) => {
      if (current.includes(movieId)) {
        return current.filter((id) => id !== movieId);
      }

      if (current.length >= 10) {
        return current;
      }

      return [...current, movieId];
    });
  }

  function beginRatings() {
    setError(null);

    if (selectedIds.length < 5) {
      setError('Choose at least 5 movies to continue.');

      return;
    }

    setRatings(Object.fromEntries(selectedIds.map((movieId) => [movieId, 8])));

    setStep('rating');
  }

  function goBack() {
    setError(null);
    setStep('selection');
  }

  function updateRating(movieId: number, rating: number) {
    setRatings((current) => ({
      ...current,
      [movieId]: rating,
    }));
  }

  function complete() {
    setError(null);

    const payload = {
      ratings: selectedIds.map((movieId) => ({
        movieId,
        rating: ratings[movieId] ?? 8,
      })),
    };

    startTransition(async () => {
      try {
        await completeTasteOnboarding(payload);

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
      await skipTasteOnboarding();

      router.replace('/home');
      router.refresh();
    });
  }

  if (step === 'selection') {
    return (
      <SelectionStep
        movies={movies}
        selectedIds={selectedIds}
        onToggle={toggleMovie}
        onContinue={beginRatings}
        onSkip={skip}
        error={error}
        isPending={isPending}
      />
    );
  }

  return (
    <RatingStep
      movies={selectedMovies}
      ratings={ratings}
      onRating={updateRating}
      onBack={goBack}
      onComplete={complete}
      error={error}
      isPending={isPending}
    />
  );
};

export default TasteOnboarding;
