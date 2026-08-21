const genres = [
  ['Drama', 32],
  ['Science Fiction', 24],
  ['Thriller', 18],
  ['Comedy', 12],
  ['Animation', 8],
];

const decades = [
  ['2010s', 48],
  ['2000s', 22],
  ['1990s', 18],
  ['Other', 12],
];

const TasteSection = () => {
  return (
    <section id="taste" className="border-b border-border/60 bg-surface/20">
      <div className="container-content py-24 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Your taste</p>

            <h2 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Your taste,
              <br />
              <span className="text-gradient-primary">visualized.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
              Over time, your shelf starts to tell a story. MovieShelf turns
              your ratings and collection into a picture of what you actually
              love.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl p-6 surface">
              <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                Top genres
              </p>

              <div className="mt-7 space-y-4">
                {genres.map(([genre, value]) => (
                  <div key={genre}>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span>{genre}</span>
                      <span className="text-muted-foreground">{value}%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 surface">
              <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                Your average
              </p>

              <div className="mt-8 flex items-end gap-3">
                <span className="font-heading text-6xl font-bold tracking-tight">
                  8.1
                </span>

                <span className="mb-3 text-rating">★</span>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                You have good taste.
              </p>

              <div className="mt-8 border-t border-border pt-6">
                <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
                  Favorite decades
                </p>

                <div className="mt-5 space-y-3">
                  {decades.map(([decade, value]) => (
                    <div
                      key={decade}
                      className="flex items-center justify-between text-xs"
                    >
                      <span>{decade}</span>
                      <span className="text-muted-foreground">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TasteSection;
