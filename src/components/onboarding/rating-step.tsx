import { tmdbImage } from '@/lib/tmdb/images';

const RatingStep = ({
  movies,
  ratings,
  onRating,
  onBack,
  onComplete,
  error,
  isPending,
}: {
  movies: Movie[];
  ratings: Record<number, number>;
  onRating: (movieId: number, rating: number) => void;
  onBack: () => void;
  onComplete: () => void;
  error: string | null;
  isPending: boolean;
}) => {
  return (
    <div className="min-h-screen">
      <div className="container-content py-8 sm:py-10">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back
          </button>

          <span className="text-xs text-muted-foreground">2 of 2</span>
        </div>

        <div className="mx-auto max-w-3xl py-16">
          <p className="eyebrow">One last thing</p>

          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Tell us how much
            <br />
            <span className="text-gradient-primary">you loved them.</span>
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
            Your ratings give us the first signals we need to understand your
            cinematic taste.
          </p>

          <div className="mt-10 space-y-3">
            {movies.map((movie) => {
              const poster = tmdbImage(movie.posterPath, 'w185');

              const currentRating = ratings[movie.id] ?? 8;

              return (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 rounded-xl p-3 surface sm:p-4"
                >
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-surface-hover">
                    {poster && (
                      <img
                        src={poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {movie.title}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {movie.releaseDate
                        ? new Date(movie.releaseDate).getFullYear()
                        : ''}
                    </p>
                  </div>

                  <div className="hidden items-center gap-1 sm:flex">
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          aria-label={`Rate ${value} out of 10`}
                          onClick={() => onRating(movie.id, value)}
                          className={[
                            'flex size-7 items-center justify-center rounded-md text-[10px] font-semibold transition-colors',
                            currentRating === value
                              ? 'bg-rating-muted text-rating'
                              : 'text-muted-foreground hover:bg-surface-hover',
                          ].join(' ')}
                        >
                          {value}
                        </button>
                      )
                    )}
                  </div>

                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-rating-muted font-heading text-sm font-bold text-rating">
                    {currentRating}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <p className="text-center text-xs text-muted-foreground">
              You can always change your ratings later.
            </p>

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
              {isPending ? 'Building your shelf...' : 'Enter MovieShelf'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingStep;
