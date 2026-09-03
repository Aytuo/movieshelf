import { tmdbImage } from '@/lib/tmdb/images';
import type { RankingItem } from '@/types';
import { Star } from 'lucide-react';
import Link from 'next/link';

type RankingListProps = {
  items: RankingItem[];
};

const RankingList = ({ items }: RankingListProps) => {
  return (
    <div className="divide-y divide-border/60 border-y border-border/60">
      {items.map((item) => {
        const { media, rank } = item;

        const poster = tmdbImage(media.posterPath, 'w342');

        const year = media.releaseDate
          ? new Date(media.releaseDate).getFullYear()
          : null;

        const href =
          media.type === 'movie'
            ? `/movie/${media.tmdbId}`
            : `/tv/${media.tmdbId}`;

        return (
          <Link
            key={`${media.type}:${media.tmdbId}`}
            href={href}
            className="group block"
          >
            <article className="relative flex gap-4 py-5 transition-colors hover:bg-surface-hover/50 sm:gap-6 sm:py-6">
              <div className="flex w-12 shrink-0 items-start justify-center pt-3 sm:w-16">
                <span className="font-heading text-3xl font-black tracking-tight text-muted-foreground/50 transition-colors group-hover:text-primary sm:text-4xl">
                  {String(rank).padStart(2, '0')}
                </span>
              </div>

              <div className="relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-lg bg-surface sm:h-[150px] sm:w-[100px] sm:rounded-xl">
                {poster ? (
                  <img
                    src={poster}
                    alt={`${media.title} poster`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
                    No poster
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 py-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  {year !== null && <span>{year}</span>}

                  {year !== null && (
                    <span className="size-1 rounded-full bg-muted-foreground/40" />
                  )}

                  <span className="font-semibold tracking-wide uppercase">
                    {media.type === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                </div>

                <h2 className="mt-2 line-clamp-2 font-heading text-lg font-bold tracking-tight transition-colors group-hover:text-primary sm:text-xl">
                  {media.title}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                    <Star className="size-3.5 fill-current text-rating" />
                    {media.rating.toFixed(1)}
                  </span>

                  <span>{media.voteCount.toLocaleString()} votes</span>
                </div>

                {media.overview && (
                  <p className="mt-3 line-clamp-2 hidden max-w-2xl text-xs leading-5 text-muted-foreground sm:block">
                    {media.overview}
                  </p>
                )}
              </div>

              <div className="hidden w-16 shrink-0 items-start justify-end pt-3 sm:flex">
                <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                  View
                </span>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
};

export default RankingList;
