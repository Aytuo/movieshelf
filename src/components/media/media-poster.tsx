import type { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { cn } from '@/lib/utils';
import {
  Bookmark,
  Check,
  Clock3,
  Film,
  Heart,
  Star,
  Tv,
  X,
} from 'lucide-react';

export type MediaPosterStatus =
  'watchlist' | 'watching' | 'watched' | 'dropped';

type MediaPosterMedia = Pick<Media, 'posterPath' | 'title' | 'type'> & {
  rating?: number | null;
};

type MediaPosterProps = {
  media: MediaPosterMedia;
  className?: string;
  compact?: boolean;
  showTmdbRating?: boolean;
  showType?: boolean;
  favorite?: boolean;
  status?: MediaPosterStatus | null;
  userRating?: number | null;
};

const statusConfig: Record<
  MediaPosterStatus,
  { label: string; icon: typeof Bookmark }
> = {
  watchlist: { label: 'Watchlist', icon: Bookmark },
  watching: { label: 'Watching', icon: Clock3 },
  watched: { label: 'Watched', icon: Check },
  dropped: { label: 'Dropped', icon: X },
};

const MediaPoster = ({
  media,
  className,
  compact = false,
  showTmdbRating = false,
  showType = false,
  favorite = false,
  status = null,
  userRating = null,
}: MediaPosterProps) => {
  const poster = tmdbImage(media.posterPath, 'w500');
  const statusInfo = status ? statusConfig[status] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-surface',
        className
      )}
    >
      {poster ? (
        <img
          src={poster}
          alt={`${media.title} poster`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
          No poster
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

      {showType && (
        <div
          className={cn(
            'absolute z-10 flex items-center justify-center bg-black/80 text-white shadow-sm backdrop-blur-sm',
            compact
              ? 'top-1.5 left-1.5 size-6 rounded-md'
              : 'top-3 left-3 size-7 rounded-md'
          )}
          title={media.type === 'movie' ? 'Film' : 'TV'}
          aria-label={media.type === 'movie' ? 'Film' : 'TV'}
        >
          {media.type === 'movie' ? (
            <Film className={compact ? 'size-3' : 'size-3.5'} />
          ) : (
            <Tv className={compact ? 'size-3' : 'size-3.5'} />
          )}
        </div>
      )}

      {favorite && (
        <div className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-black/70 text-primary backdrop-blur-sm">
          <Heart className="size-3.5" fill="currentColor" />
        </div>
      )}

      {showTmdbRating && (media.rating ?? 0) > 0 && (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
          <Star className="size-3 fill-current text-rating" />
          {(media.rating ?? 0).toFixed(1)}
        </div>
      )}

      {userRating !== null && (
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-semibold text-rating">
          <Star className="size-3 fill-current" />
          {userRating}
        </div>
      )}

      {statusInfo && StatusIcon && (
        <div className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
          <StatusIcon className="size-3" />
          {statusInfo.label}
        </div>
      )}
    </div>
  );
};

export default MediaPoster;
