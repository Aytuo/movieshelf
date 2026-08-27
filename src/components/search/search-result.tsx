import { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SearchResults = ({
  results,
  onResultClick,
}: {
  results: Media[];
  onResultClick: () => void;
}) => {
  return (
    <div className="py-2">
      {results.map((movie) => {
        const poster = tmdbImage(movie.posterPath, 'w185');

        return (
          <Link
            key={movie.tmdbId}
            href={`/movie/${movie.tmdbId}`}
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
              <p className="truncate text-sm font-semibold">{movie.title}</p>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                {movie.releaseDate && (
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                )}

                {movie.rating > 0 && (
                  <>
                    <span>•</span>

                    <span className="text-rating">
                      ★ {movie.rating.toFixed(1)}
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

export default SearchResults;
