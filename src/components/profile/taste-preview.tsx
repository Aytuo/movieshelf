import type { TasteProfile } from '@/types';
import Link from 'next/link';

type TastePreviewProps = {
  taste: TasteProfile;
  username: string;
};

const TastePreview = ({ taste, username }: TastePreviewProps) => {
  return (
    <div className="rounded-2xl p-6 surface">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Top genres
          </p>

          <div className="mt-5 grid gap-5">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Movies
              </p>

              <div className="flex flex-wrap gap-2">
                {taste.movie.topGenres.slice(0, 4).map((genre) => (
                  <span
                    key={genre.name}
                    className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                TV Series
              </p>

              <div className="flex flex-wrap gap-2">
                {taste.tv.topGenres.slice(0, 4).map((genre) => (
                  <span
                    key={genre.name}
                    className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.15em] text-muted-foreground uppercase">
            Average rating
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Movies</p>

              <p className="mt-1 font-heading text-4xl font-bold">
                {taste.movie.averageRating ?? '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">TV Series</p>

              <p className="mt-1 font-heading text-4xl font-bold">
                {taste.tv.averageRating ?? '—'}
              </p>
            </div>
          </div>

          <Link
            href={`/profile/${username}/taste`}
            className="mt-5 inline-block text-sm font-medium text-primary hover:underline"
          >
            See your full taste profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TastePreview;
