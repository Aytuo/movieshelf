import { getTasteSummary } from '@/lib/taste/taste-summary';
import { Star } from 'lucide-react';

type TasteProfileProps = {
  taste: TasteProfile;
};

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 surface">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="mt-4 font-heading text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}

const TasteProfile = ({ taste }: TasteProfileProps) => {
  const summary = getTasteSummary(taste);

  const maxRatingCount = Math.max(
    ...taste.ratingDistribution.map((item) => item.count),
    1
  );

  const tasteProgress = Math.min(taste.watchedMovies / 50, 1);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary-muted p-6 sm:p-8">
        <div className="pointer-events-none absolute top-[-35%] right-[-10%] size-72 rounded-full bg-primary/10 blur-[90px]" />

        <div className="relative">
          <p className="eyebrow">Your cinematic fingerprint</p>

          <h2 className="mt-4 max-w-2xl font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {summary.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {summary.description}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Watched" value={taste.watchedMovies} />

        <Stat label="Rated" value={taste.ratedMovies} />

        <Stat label="Favorites" value={taste.favoriteMovies} />

        <Stat
          label="Average"
          value={taste.averageRating ? taste.averageRating : '—'}
          icon={
            taste.averageRating ? (
              <Star className="size-3.5 fill-current text-rating" />
            ) : undefined
          }
        />
      </section>

      {/* Taste profile maturity */}
      <section className="rounded-2xl p-6 surface">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Taste profile</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {taste.watchedMovies < 10
                ? 'Your cinematic identity is just getting started.'
                : taste.watchedMovies < 30
                  ? "We're starting to see your patterns."
                  : 'Your taste is becoming very distinctive.'}
            </p>
          </div>

          <span className="text-xs text-muted-foreground">
            {taste.watchedMovies} films
          </span>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${tasteProgress * 100}%`,
            }}
          />
        </div>
      </section>

      {/* Genres + decades */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 surface">
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Top genres
          </p>

          <div className="mt-7 space-y-4">
            {taste.topGenres.length > 0 ? (
              taste.topGenres.map((genre) => (
                <div key={genre.name}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium">{genre.name}</span>

                    <span className="text-muted-foreground">
                      {genre.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-700"
                      style={{
                        width: `${genre.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Rate a few movies to see your favorite genres.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6 surface">
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Favorite decades
          </p>

          <div className="mt-7 space-y-4">
            {taste.favoriteDecades.length > 0 ? (
              taste.favoriteDecades.map((decade) => (
                <div key={decade.decade}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium">{decade.decade}</span>

                    <span className="text-muted-foreground">
                      {decade.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${decade.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Your favorite eras will appear here.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Rating distribution */}
      <section className="rounded-2xl p-6 surface sm:p-7">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Rating distribution
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            How you score the movies you watch.
          </p>
        </div>

        <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
          {taste.ratingDistribution.map((item) => {
            const height =
              item.count === 0
                ? 4
                : Math.max((item.count / maxRatingCount) * 100, 10);

            return (
              <div
                key={item.rating}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div className="group relative flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/70 transition-[height,background-color] duration-300 group-hover:bg-primary"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>

                <span className="mt-2 text-center text-[10px] text-muted-foreground">
                  {item.rating}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TasteProfile;
