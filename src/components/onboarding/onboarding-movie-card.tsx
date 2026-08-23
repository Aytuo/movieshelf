'use client';

import { tmdbImage } from '@/lib/tmdb/images';

type OnboardingMovieCardProps = {
  movie: Movie;
  selected: boolean;
  onToggle: (movieId: number) => void;
};

const OnboardingMovieCard = ({
  movie,
  selected,
  onToggle,
}: OnboardingMovieCardProps) => {
  const poster = tmdbImage(movie.posterPath, 'w342');

  return (
    <button
      type="button"
      onClick={() => onToggle(movie.id)}
      aria-pressed={selected}
      className={[
        'group relative overflow-hidden rounded-xl text-left transition-all duration-200',
        selected
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
          : 'hover:ring-border-strong ring-1 ring-border',
      ].join(' ')}
    >
      <div className="aspect-[2/3] bg-surface">
        {poster && (
          <img
            src={poster}
            alt={`${movie.title} poster`}
            className={[
              'h-full w-full object-cover transition-all duration-300',
              selected ? 'scale-[1.02]' : 'group-hover:scale-[1.03]',
            ].join(' ')}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {selected && (
        <div className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
          ✓
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="line-clamp-1 text-xs font-semibold text-white">
          {movie.title}
        </p>

        <p className="mt-1 text-[10px] text-white/55">
          {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
        </p>
      </div>
    </button>
  );
};

export default OnboardingMovieCard;
