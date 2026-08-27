import { Media } from '@/lib/media';
import Link from 'next/link';
import OnboardingMovieCard from './onboarding-movie-card';

const SelectionStep = ({
  movies,
  selectedIds,
  onToggle,
  onContinue,
  onSkip,
  error,
  isPending,
}: {
  movies: Media[];
  selectedIds: number[];
  onToggle: (movieId: number) => void;
  onContinue: () => void;
  onSkip: () => void;
  error: string | null;
  isPending: boolean;
}) => {
  return (
    <div className="min-h-screen">
      <div className="container-content py-8 sm:py-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Movie<span className="text-primary">Shelf</span>
          </Link>

          <span className="text-xs text-muted-foreground">1 of 2</span>
        </div>

        <div className="mx-auto max-w-4xl pt-16 pb-12 sm:pt-20">
          <p className="eyebrow">Let&apos;s get to know your taste</p>

          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Pick the movies
            <br />
            <span className="text-gradient-primary">you already love.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Choose at least 5 films you&apos;ve already seen. Don&apos;t
            overthink it — pick the movies that feel like you.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${Math.max((selectedIds.length / 5) * 100, 8)}%`,
                }}
              />
            </div>

            <span className="text-xs text-muted-foreground">
              {selectedIds.length}/5
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {movies.map((movie) => (
            <OnboardingMovieCard
              key={movie.tmdbId}
              movie={movie}
              selected={selectedIds.includes(movie.tmdbId)}
              onToggle={onToggle}
            />
          ))}
        </div>

        {error && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="sticky bottom-4 z-30 mt-10 flex justify-center">
          <button
            type="button"
            onClick={onContinue}
            disabled={selectedIds.length < 5 || isPending}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_var(--primary-glow)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue with {selectedIds.length}{' '}
            {selectedIds.length === 1 ? 'movie' : 'movies'}
          </button>

          <button
            type="button"
            onClick={onSkip}
            disabled={isPending}
            className="mt-3 block w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            I&apos;ll do this later
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionStep;
