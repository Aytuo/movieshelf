import type { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const GlobalSearchResults = ({
  results,
  onResultClick,
}: {
  results: Media[];
  onResultClick: () => void;
}) => {
  return (
    <div className="py-2">
      {results.map((media) => {
        const poster = tmdbImage(media.posterPath, 'w185');

        const href =
          media.type === 'movie'
            ? `/movie/${media.tmdbId}`
            : `/tv/${media.tmdbId}`;

        return (
          <Link
            key={`${media.type}:${media.tmdbId}`}
            href={href}
            onClick={onResultClick}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
          >
            <div className="size-12 shrink-0 overflow-hidden rounded-md bg-surface">
              {poster && (
                <img
                  src={poster}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{media.title}</p>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {media.releaseDate && (
                  <span>{new Date(media.releaseDate).getFullYear()}</span>
                )}

                <span className="text-[10px] font-semibold tracking-wide uppercase">
                  {media.type === 'movie' ? 'Movie' : 'TV Series'}
                </span>

                {media.rating > 0 && (
                  <>
                    <span>•</span>

                    <span className="text-rating">
                      ★ {media.rating.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
};

export default GlobalSearchResults;
