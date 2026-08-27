'use client';

import { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

type MovieCarouselProps = {
  movies: Media[];
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
};

const MovieCarousel = ({
  movies,
  title,
  eyebrow,
  description,
  href,
}: MovieCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(movies.length > 0);

  function updateControls() {
    if (!ref.current) {
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = ref.current;

    setCanScrollLeft(scrollLeft > 10);

    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }

  function scroll(direction: 'left' | 'right') {
    if (!ref.current) {
      return;
    }

    const amount = ref.current.clientWidth * 0.8;

    ref.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }

  return (
    <section className="container-content py-10 lg:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {href && (
            <Link
              href={href}
              className="mr-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              See all
            </Link>
          )}

          <button
            type="button"
            disabled={!canScrollLeft}
            onClick={() => scroll('left')}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            disabled={!canScrollRight}
            onClick={() => scroll('right')}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={updateControls}
        className="-mx-1 flex snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto px-1 pb-2"
      >
        {movies.map((movie) => {
          const poster = tmdbImage(movie.posterPath, 'w500');

          return (
            <Link
              key={movie.tmdbId}
              href={`/movie/${movie.tmdbId}`}
              className="group w-[155px] shrink-0 snap-start sm:w-[180px] lg:w-[200px]"
            >
              <article>
                <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                  {poster && (
                    <img
                      src={poster}
                      alt={`${movie.title} poster`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </div>

                <h3 className="mt-3 line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                  {movie.title}
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : '—'}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MovieCarousel;
