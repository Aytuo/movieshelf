import type { Media, MediaType } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { cn } from '@/lib/utils';
import { ArrowLeft, Clapperboard, Info, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import OnboardingStepIndicator from './onboarding-step-indicator';

type RatingStepProps = {
  media: Media[];
  type: MediaType;
  ratings: Record<number, number>;
  onRating: (tmdbId: number, rating: number) => void;
  onBack: () => void;
  onComplete: () => void;
  error: string | null;
  isPending: boolean;
};

const RatingStep = ({
  media,
  type,
  ratings,
  onRating,
  onBack,
  onComplete,
  error,
  isPending,
}: RatingStepProps) => {
  const isMovie = type === 'movie';

  return (
    <div className="min-h-screen">
      <div className="container-content py-8 sm:py-10">
        {/* Brand + progress */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary-glow)] transition-transform duration-200 group-hover:scale-105">
              <Clapperboard className="size-4" strokeWidth={2.2} />
            </span>

            <span className="text-lg font-bold tracking-tight">
              Movie
              <span className="text-primary">Shelf</span>
            </span>
          </Link>

          <OnboardingStepIndicator type={type} />
        </div>

        {/* Back + heading */}
        <div className="mx-auto max-w-3xl pt-10 sm:pt-14">
          <button
            type="button"
            onClick={onBack}
            className="mb-7 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>

          <p className="eyebrow">One last thing</p>

          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Tell us how much
            <br />
            <span className="text-gradient-primary">you loved them.</span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            Your ratings give us the first signals we need to understand your{' '}
            {isMovie ? 'movie taste' : 'TV taste'}.
          </p>

          <div className="mt-10 space-y-3">
            {media.map((item) => {
              const poster = tmdbImage(item.posterPath, 'w185');

              const currentRating = ratings[item.tmdbId] ?? 8;

              return (
                <div
                  key={`${item.type}:${item.tmdbId}`}
                  className="grid gap-3 rounded-xl border border-border/60 p-3 transition-colors surface sm:p-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-5"
                >
                  {/* Movie information + mobile rating */}
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-hover sm:size-16">
                      {poster && (
                        <Image
                          src={poster}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.releaseDate
                          ? new Date(item.releaseDate).getFullYear()
                          : ''}
                      </p>
                    </div>

                    {/* Rating stays next to the title on smaller screens */}
                    <div
                      role="img"
                      aria-label={`Current rating: ${currentRating} out of 10`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-1.5 py-2 text-rating lg:hidden"
                    >
                      <Star
                        className="size-4 fill-current"
                        aria-hidden="true"
                      />

                      <span className="font-heading text-sm font-semibold tabular-nums">
                        {currentRating}
                        <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                          /10
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Rating selector */}
                  <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 lg:flex lg:gap-1">
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          aria-label={`Rate ${item.title} ${value} out of 10`}
                          aria-pressed={currentRating === value}
                          onClick={() => onRating(item.tmdbId, value)}
                          className={cn(
                            'flex h-9 w-full items-center justify-center rounded-md text-xs font-semibold transition-colors sm:h-8 lg:size-7 lg:text-[10px]',
                            currentRating === value
                              ? 'bg-rating-muted text-rating ring-1 ring-rating/30'
                              : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                          )}
                        >
                          {value}
                        </button>
                      )
                    )}
                  </div>

                  {/* Final rating at the far right on desktop */}
                  <div
                    role="img"
                    aria-label={`Current rating: ${currentRating} out of 10`}
                    className="hidden shrink-0 items-center gap-1.5 justify-self-end rounded-lg px-1.5 py-2 text-rating lg:inline-flex"
                  >
                    <Star className="size-4 fill-current" aria-hidden="true" />

                    <span className="font-heading text-sm font-semibold tabular-nums">
                      {currentRating}
                      <span className="ml-0.5 text-xs font-medium text-muted-foreground">
                        /10
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex justify-end">
            <p className="inline-flex items-center gap-1.5 text-right text-xs leading-5 text-muted-foreground">
              <Info className="size-3.5 shrink-0" aria-hidden="true" />
              You can always change your ratings later.
            </p>
          </div>

          <div className="mt-6">
            {error && (
              <div className="mx-auto mt-4 max-w-xl rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={onComplete}
              disabled={isPending}
              className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_var(--primary-glow)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? 'Saving your ratings...'
                : isMovie
                  ? 'Continue to TV Series'
                  : 'Finish ratings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingStep;
