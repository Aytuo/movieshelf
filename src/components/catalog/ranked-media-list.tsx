import type { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { Star } from 'lucide-react';
import Link from 'next/link';

type RankedMediaListProps = {
  media: Media[];
  eyebrow?: string;
  title?: string;
  description?: string;
  showType?: boolean;
};

const RankedMediaList = ({
  media,
  eyebrow,
  title,
  description,
  showType = false,
}: RankedMediaListProps) => {
  const rankedMedia = media.slice(0, 10);

  if (!rankedMedia.length) {
    return null;
  }

  return (
    <section className="overflow-hidden border-y border-border/60 py-16 lg:py-24">
      <div className="container-content">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">{eyebrow ?? 'Weekly chart'}</p>

          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {title ?? 'Top 10 this week'}
          </h2>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description ??
              'The media creating the biggest momentum across TMDB this week.'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {rankedMedia.map((item, index) => {
            const rank = String(index + 1).padStart(2, '0');

            const year = item.releaseDate
              ? new Date(item.releaseDate).getFullYear()
              : null;

            const posterUrl = tmdbImage(item.posterPath, 'w500');

            const href =
              item.type === 'movie'
                ? `/movie/${item.tmdbId}`
                : `/tv/${item.tmdbId}`;

            return (
              <Link
                key={`${item.type}:${item.tmdbId}`}
                href={href}
                className="group"
              >
                <article className="relative isolate min-h-[240px] overflow-hidden rounded-2xl border border-border/60 bg-surface">
                  {/* Giant ranking number */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 -left-4 z-0 font-heading text-[11rem] leading-none font-black tracking-[-0.08em] text-foreground/[0.055] transition-all duration-500 select-none group-hover:translate-x-2 group-hover:text-primary/[0.10]"
                  >
                    {rank}
                  </span>

                  <div className="relative z-10 flex min-h-[240px] items-center gap-5 p-5 sm:p-6">
                    {/* Poster */}
                    <div className="relative h-[190px] w-[128px] shrink-0 overflow-hidden rounded-xl shadow-2xl">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={`${item.title} poster`}
                          sizes="128px"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface-hover px-3 text-center text-xs text-muted-foreground">
                          No poster
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-[0.2em] text-primary">
                          #{rank}
                        </span>

                        {showType && (
                          <span className="text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                            {item.type === 'movie' ? 'Movie' : 'TV'}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 line-clamp-3 font-heading text-xl font-bold tracking-tight transition-colors group-hover:text-primary sm:text-2xl">
                        {item.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        {year !== null && (
                          <>
                            <span>{year}</span>
                            <span className="size-1 rounded-full bg-muted-foreground/40" />
                          </>
                        )}

                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3 fill-current text-rating" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Ranking based on TMDB weekly trending data.
        </p>
      </div>
    </section>
  );
};

export default RankedMediaList;
