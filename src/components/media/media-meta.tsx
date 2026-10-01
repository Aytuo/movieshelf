import { cn } from '@/lib/utils';

type MediaMetaProps = {
  title: string;
  releaseDate: string | null;
  genres?: {
    id: number;
    name: string;
  }[];
  genreLimit?: number;
  showGenres?: boolean;
  className?: string;
};

function getYear(releaseDate: string | null) {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

const MediaMeta = ({
  title,
  releaseDate,
  genres = [],
  genreLimit = 1,
  showGenres = true,
  className,
}: MediaMetaProps) => {
  const year = getYear(releaseDate);
  const visibleGenres = genres.slice(0, genreLimit);

  return (
    <div className={cn('min-w-0', className)}>
      <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
        {title}
      </h3>

      <p className="mt-1 text-xs text-muted-foreground">{year ?? '—'}</p>

      {showGenres && visibleGenres.length > 0 && (
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {visibleGenres.map((genre) => genre.name).join(' · ')}
        </p>
      )}
    </div>
  );
};

export default MediaMeta;
