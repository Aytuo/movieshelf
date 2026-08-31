import type { MediaType } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { Check, Clock3, Film, Tv } from 'lucide-react';
import Link from 'next/link';

type HistoryCardProps = {
  item: {
    history: {
      id: string;
      watchedAt: Date;
    };

    media: {
      type: MediaType;
      tmdbId: number;
      title: string;
      posterPath: string | null;
      releaseDate: string | null;
    };

    watchNumber: number;
  };
};

const HistoryCard = ({ item }: HistoryCardProps) => {
  const { media, history, watchNumber } = item;

  const href =
    media.type === 'movie' ? `/movie/${media.tmdbId}` : `/tv/${media.tmdbId}`;

  const poster = tmdbImage(media.posterPath, 'w500');

  const mediaLabel = media.type === 'movie' ? 'Movie' : 'TV Series';

  const MediaIcon = media.type === 'movie' ? Film : Tv;

  const watchLabel =
    watchNumber === 1 ? 'Watch #1' : `Rewatch #${watchNumber - 1}`;

  return (
    <Link href={href} className="group flex gap-4 rounded-2xl p-4 surface">
      <div className="relative w-20 shrink-0 overflow-hidden rounded-xl bg-surface-hover">
        {poster ? (
          <img
            src={poster}
            alt={`${media.title} poster`}
            className="aspect-[2/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center px-2 text-center text-[10px] text-muted-foreground">
            No poster
          </div>
        )}

        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <MediaIcon className="size-3" />
          {mediaLabel}
        </span>
      </div>

      <div className="min-w-0 py-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock3 className="size-3.5" />

          {new Date(history.watchedAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </div>

        <h2 className="mt-2 line-clamp-2 font-heading text-lg font-semibold transition-colors group-hover:text-primary">
          {media.title}
        </h2>

        {media.releaseDate && (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(media.releaseDate).getFullYear()}
          </p>
        )}

        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="size-3.5 text-primary" />
          {watchLabel}
        </p>
      </div>
    </Link>
  );
};

export default HistoryCard;
