import { tmdbImage } from '@/lib/tmdb/images';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type ProfileMediaItem = {
  media: {
    tmdbId: string | number;
    type: 'movie' | 'tv';
    title: string;
    posterPath: string | null;
  };
};

type ProfileMediaShelfProps = {
  eyebrow: string;
  title: string;
  items: ProfileMediaItem[];
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: LucideIcon;
};

export function ProfileMediaShelf({
  eyebrow,
  title,
  items,
  emptyTitle,
  emptyDescription,
  emptyIcon: EmptyIcon,
}: ProfileMediaShelfProps) {
  return (
    <section className="py-10 lg:py-14">
      <div className="mb-7">
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="mt-2 font-heading text-2xl font-bold">{title}</h2>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {items.map(({ media }) => {
            const poster = tmdbImage(media.posterPath, 'w500');

            const href =
              media.type === 'movie'
                ? `/movie/${media.tmdbId}`
                : `/tv/${media.tmdbId}`;

            return (
              <Link
                key={`${media.type}:${media.tmdbId}`}
                href={href}
                className="group"
              >
                <article>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                    {poster ? (
                      <img
                        src={poster}
                        alt={`${media.title} poster`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-sm text-muted-foreground">
                        No poster
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    <p className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
                      {media.title}
                    </p>

                    <p className="mt-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                      {media.type === 'movie' ? 'Movie' : 'TV Series'}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl p-12 text-center surface">
          <EmptyIcon className="mx-auto size-6 text-muted-foreground" />

          <h3 className="mt-4 font-heading text-xl font-semibold">
            {emptyTitle}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {emptyDescription}
          </p>
        </div>
      )}
    </section>
  );
}
