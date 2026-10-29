import { Star } from 'lucide-react';

const genres = [
  ['Drama', 32],
  ['Science Fiction', 24],
  ['Thriller', 18],
  ['Comedy', 12],
] as const;

const decades = [
  ['2010s', 48],
  ['2000s', 22],
  ['1990s', 18],
] as const;

const ratingDistribution = [
  { rating: 1, count: 0 },
  { rating: 2, count: 0 },
  { rating: 3, count: 1 },
  { rating: 4, count: 1 },
  { rating: 5, count: 2 },
  { rating: 6, count: 3 },
  { rating: 7, count: 4 },
  { rating: 8, count: 6 },
  { rating: 9, count: 7 },
  { rating: 10, count: 4 },
];

const maxRatingCount = Math.max(
  ...ratingDistribution.map((item) => item.count),
  1
);

const TasteSection = () => {
  const watched = 34;
  const rated = 28;
  const favorites = 8;
  const averageRating = '8.1';
  const tasteProgress = Math.min(watched / 50, 1);

  return (
    <section id="taste" className="border-b border-border/60 bg-surface/20">
      <div className="container-content py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Editorial copy */}
          <div>
            <p className="eyebrow">Your taste</p>

            <h2 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Your taste,
              <br />
              <span className="text-gradient-primary">visualized.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
              Your ratings reveal more with every title. MovieShelf brings your
              movies and TV shows together to visualize the genres, eras and
              stories that shape your taste.
            </p>
          </div>

          {/* TasteOverview-inspired preview */}
          <div className="min-w-0 space-y-4">
            {/* Overview stats */}
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Watched</p>
                <p className="mt-3 font-heading text-2xl font-bold tracking-tight">
                  {watched}
                </p>
              </div>

              <div className="rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Rated</p>
                <p className="mt-3 font-heading text-2xl font-bold tracking-tight">
                  {rated}
                </p>
              </div>

              <div className="rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Favorites</p>
                <p className="mt-3 font-heading text-2xl font-bold tracking-tight">
                  {favorites}
                </p>
              </div>

              <div className="rounded-xl p-3 surface sm:p-4">
                <p className="text-xs text-muted-foreground">Average</p>
                <div className="mt-3 flex items-center gap-1.5 font-heading text-2xl font-bold tracking-tight">
                  <Star className="size-3.5 fill-current text-rating" />
                  <span>{averageRating}</span>
                </div>
              </div>
            </section>

            {/* Taste profile maturity */}
            <section className="rounded-2xl p-5 surface sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Taste profile</p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your taste is becoming very distinctive.
                  </p>
                </div>

                <span className="shrink-0 text-xs text-muted-foreground">
                  {watched} movies
                </span>
              </div>

              <div className="mt-5 h-[6px] overflow-hidden rounded-full bg-surface-hover">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${tasteProgress * 100}%` }}
                />
              </div>
            </section>

            {/* Genres and decades */}
            <section className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 rounded-2xl p-5 surface sm:p-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  Top genres
                </p>

                <div className="mt-6 space-y-4">
                  {genres.map(([genre, percentage]) => (
                    <div key={genre}>
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium">{genre}</span>
                        <span className="text-muted-foreground">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-[6px] overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 rounded-2xl p-5 surface sm:p-6">
                <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                  Favorite decades
                </p>

                <div className="mt-6 space-y-4">
                  {decades.map(([decade, percentage]) => (
                    <div key={decade}>
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium">{decade}</span>
                        <span className="text-muted-foreground">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-[6px] overflow-hidden rounded-full bg-surface-hover">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Rating distribution */}
            <section className="rounded-2xl p-5 surface sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.15em] uppercase">
                    Rating distribution
                  </p>

                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    How you score the movies you watch.
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground tabular-nums">
                  {rated} ratings
                </span>
              </div>

              <div className="mt-6 flex h-36 items-stretch gap-1 sm:h-44 sm:gap-2">
                {ratingDistribution.map((item) => {
                  const barHeight = (item.count / maxRatingCount) * 78;

                  return (
                    <div
                      key={item.rating}
                      className="flex min-w-0 flex-1 flex-col"
                    >
                      <div className="group relative min-h-0 flex-1">
                        <span
                          className="absolute z-10 -translate-x-1/2 text-[9px] leading-none text-muted-foreground tabular-nums sm:text-[10px]"
                          style={{
                            left: '50%',
                            bottom:
                              item.count > 0
                                ? `calc(${barHeight}% + 6px)`
                                : '7px',
                          }}
                        >
                          {item.count}
                        </span>

                        <div
                          className={`absolute inset-x-0 bottom-0 rounded-t-md ${
                            item.count > 0 ? 'bg-primary/70' : 'bg-border'
                          }`}
                          style={{
                            height: item.count > 0 ? `${barHeight}%` : '1px',
                          }}
                        />
                      </div>

                      <span className="mt-2 text-center text-[9px] text-muted-foreground tabular-nums sm:text-[10px]">
                        {item.rating}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TasteSection;
