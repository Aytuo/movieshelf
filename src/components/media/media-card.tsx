import type { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { Star } from 'lucide-react';
import Link from 'next/link';

type MediaCardProps = {
  media: Media;
};

const MediaCard = ({ media }: MediaCardProps) => {
  const poster = tmdbImage(media.posterPath, 'w500');

  const href =
    media.type === 'movie' ? `/movie/${media.tmdbId}` : `/tv/${media.tmdbId}`;

  const year = media.releaseDate
    ? new Date(media.releaseDate).getFullYear()
    : null;

  return (
    <Link href={href} className="group block">
      <article>
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
          {poster ? (
            <img
              src={poster}
              alt={`${media.title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No poster
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Star className="size-3 fill-current text-rating" />
            {media.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-start gap-2">
            <h3 className="line-clamp-1 flex-1 text-sm font-semibold transition-colors group-hover:text-primary">
              {media.title}
            </h3>

            <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {media.type === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{year ?? '—'}</span>

            {media.genres[0] && (
              <>
                <span className="size-0.5 rounded-full bg-muted-foreground/50" />
                <span>{media.genres[0].name}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default MediaCard;
