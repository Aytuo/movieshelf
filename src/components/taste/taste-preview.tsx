import type { TasteProfile } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

type TastePreviewProps = {
  taste: TasteProfile;
  username: string;
};

const TastePreview = ({ taste, username }: TastePreviewProps) => {
  const movieTopGenre = taste.movie.topGenres[0]?.name;

  const tvTopGenre = taste.tv.topGenres[0]?.name;

  const movieGenres = taste.movie.topGenres.slice(0, 4);

  const tvGenres = taste.tv.topGenres.slice(0, 4);

  const movieDecades = taste.movie.favoriteDecades.slice(0, 3);

  const tvDecades = taste.tv.favoriteDecades.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/15 bg-primary-muted">
      <div className="relative p-6 sm:p-8">
        <div className="pointer-events-none absolute top-[-25%] right-[-5%] size-72 rounded-full bg-primary/10 blur-[100px]" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />

              <p className="eyebrow">Your insights</p>
            </div>

            <Link
              href={`/profile/${username}/taste`}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Explore more
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Insights */}
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {/* Movies */}
            <section className="rounded-xl border border-border/60 bg-background/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold">Movies</h2>

                {movieTopGenre && (
                  <span className="text-xs text-muted-foreground">
                    {movieTopGenre} is your #1
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-6">
                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Top genres
                  </p>

                  {movieGenres.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {movieGenres.map((genre) => (
                        <span
                          key={genre.name}
                          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-muted-foreground">
                      Rate a few titles to start building your profile.
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Favorite eras
                  </p>

                  {movieDecades.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {movieDecades.map((decade) => (
                        <span
                          key={decade.decade}
                          className="text-xs font-medium text-foreground"
                        >
                          {decade.decade}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-muted-foreground">
                      Your favorite eras will appear here.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* TV Series */}
            <section className="rounded-xl border border-border/60 bg-background/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold">TV Series</h2>

                {tvTopGenre && (
                  <span className="text-xs text-muted-foreground">
                    {tvTopGenre} is your #1
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-6">
                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Top genres
                  </p>

                  {tvGenres.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tvGenres.map((genre) => (
                        <span
                          key={genre.name}
                          className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-muted-foreground"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-muted-foreground">
                      Rate a few titles to start building your profile.
                    </p>
                  )}
                </div>

                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    Favorite eras
                  </p>

                  {tvDecades.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {tvDecades.map((decade) => (
                        <span
                          key={decade.decade}
                          className="text-xs font-medium text-foreground"
                        >
                          {decade.decade}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-muted-foreground">
                      Your favorite eras will appear here.
                    </p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TastePreview;
