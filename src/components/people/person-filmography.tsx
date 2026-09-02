import { tmdbImage } from '@/lib/tmdb/images';
import type { PersonCredit } from '@/types';
import { Star } from 'lucide-react';
import Link from 'next/link';

type PersonFilmographyProps = {
  movies: PersonCredit[];
  tv: PersonCredit[];
};

function formatYear(date: string | null) {
  if (!date) {
    return null;
  }

  const year = Number(date.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

function FilmographyTable({ credits }: { credits: PersonCredit[] }) {
  return (
    <div className="overflow-hidden rounded-2xl surface">
      <div className="hidden grid-cols-[80px_56px_1fr_72px] gap-4 border-b border-border/60 px-5 py-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase sm:grid">
        <span>Year</span>
        <span aria-hidden />
        <span>Title & role</span>
        <span className="text-right">Rating</span>
      </div>

      <div className="divide-y divide-border/60">
        {credits.map((credit) => {
          const year = formatYear(credit.releaseDate);

          return (
            <Link
              key={`${credit.type}-${credit.tmdbId}-${credit.creditId}`}
              href={`/${credit.type === 'movie' ? 'movie' : 'tv'}/${credit.tmdbId}`}
              className="group grid grid-cols-[56px_48px_1fr_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-surface-hover sm:grid-cols-[80px_56px_1fr_72px] sm:gap-4 sm:px-5"
            >
              <span className="text-sm text-muted-foreground tabular-nums">
                {year ?? '—'}
              </span>

              <div className="h-[64px] w-11 overflow-hidden rounded-md bg-surface-hover sm:h-[72px] sm:w-12">
                {credit.posterPath ? (
                  <img
                    src={tmdbImage(credit.posterPath, 'w185') ?? undefined}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                  {credit.title}
                </p>

                {credit.character && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {credit.character}
                  </p>
                )}
              </div>

              <span className="inline-flex items-center justify-end gap-1 text-xs font-medium tabular-nums">
                <Star className="size-3.5 fill-current text-rating" />
                {credit.rating.toFixed(1)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function FilmographySection({
  title,
  credits,
}: {
  title: string;
  credits: PersonCredit[];
}) {
  if (credits.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-4">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>

        <span className="text-xs text-muted-foreground tabular-nums">
          ({credits.length})
        </span>
      </div>

      <FilmographyTable credits={credits} />
    </div>
  );
}

const PersonFilmography = ({ movies, tv }: PersonFilmographyProps) => {
  if (movies.length === 0 && tv.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-8">
        <p className="eyebrow">Filmography</p>
        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Acting
        </h2>
      </div>

      <div className="space-y-10">
        <FilmographySection title="Movies" credits={movies} />
        <FilmographySection title="TV Series" credits={tv} />
      </div>
    </section>
  );
};

export default PersonFilmography;
