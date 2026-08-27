import { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { Star } from 'lucide-react';
import Link from 'next/link';

type MovieCardProps = {
  movie: Media;
};

const MovieCard = ({ movie }: MovieCardProps) => {
  const poster = tmdbImage(movie.posterPath, 'w500');

  return (
    <Link href={`/movie/${movie.tmdbId}`} className="group block">
      <article>
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
          {poster ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
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
            {movie.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
            {movie.title}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {movie.releaseDate
                ? new Date(movie.releaseDate).getFullYear()
                : '—'}
            </span>

            {movie.genres[0] && (
              <>
                <span className="size-0.5 rounded-full bg-muted-foreground/50" />
                <span>{movie.genres[0].name}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default MovieCard;
