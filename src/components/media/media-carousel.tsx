'use client';

import type { Media } from '@/lib/media';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import MediaMeta from './media-meta';
import MediaPoster from './media-poster';

type MediaCarouselProps = {
  media: Media[];
  title: string;
  eyebrow?: string;
  description?: string;
  href?: string;
  showType?: boolean;
};

const MediaCarousel = ({
  media,
  title,
  eyebrow,
  description,
  href,
  showType = false,
}: MediaCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [canScrollRight, setCanScrollRight] = useState(media.length > 0);

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

  useEffect(() => {
    updateControls();

    const element = ref.current;

    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateControls);

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [media.length]);

  return (
    <section className="py-10 lg:py-14">
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
            aria-label="Scroll left"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            disabled={!canScrollRight}
            onClick={() => scroll('right')}
            aria-label="Scroll right"
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
        {media.map((item) => {
          const href =
            item.type === 'movie'
              ? `/movie/${item.tmdbId}`
              : `/tv/${item.tmdbId}`;

          return (
            <Link
              key={`${item.type}:${item.tmdbId}`}
              href={href}
              className="group w-[155px] shrink-0 snap-start sm:w-[180px] lg:w-[200px]"
            >
              <article>
                <MediaPoster
                  media={item}
                  showTmdbRating
                  showType={showType}
                  className="aspect-[2/3]"
                />

                <div className="mt-3">
                  <MediaMeta
                    title={item.title}
                    releaseDate={item.releaseDate}
                    genres={item.genres}
                    genreLimit={1}
                  />
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MediaCarousel;
