'use client';

import type { TvScheduleItem } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type TvScheduleCarouselProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: TvScheduleItem[];
};

function formatEpisodeNumber(
  seasonNumber: number,
  episodeNumber: number
): string {
  return `S${String(seasonNumber).padStart(2, '0')}E${String(
    episodeNumber
  ).padStart(2, '0')}`;
}

function formatAirDate(date: string | null): string | null {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const TvScheduleCarousel = ({
  eyebrow,
  title,
  description,
  items,
}: TvScheduleCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(items.length > 0);

  const visibleItems = items.slice(0, 20);

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
  }, [visibleItems.length]);

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

      {visibleItems.length > 0 ? (
        <div
          ref={ref}
          onScroll={updateControls}
          className="-mx-1 flex snap-x snap-mandatory scrollbar-none gap-4 overflow-x-auto px-1 pb-2"
        >
          {visibleItems.map(({ media, episode }) => {
            const still = tmdbImage(episode.stillPath, 'w780');
            const poster = tmdbImage(media.posterPath, 'w500');
            const image = still ?? poster;
            const airDate = formatAirDate(episode.airDate);

            return (
              <Link
                key={episode.id}
                href={`/tv/${media.tmdbId}`}
                className="group w-[290px] shrink-0 snap-start sm:w-[320px]"
              >
                <article className="flex h-full flex-col">
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
                    <div className="aspect-video overflow-hidden bg-surface-hover">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex min-h-[132px] flex-col p-4 sm:min-h-[140px]">
                      <p className="font-mono text-xs font-medium text-muted-foreground">
                        {formatEpisodeNumber(
                          episode.seasonNumber,
                          episode.episodeNumber
                        )}

                        {airDate && ` · ${airDate}`}
                      </p>

                      <h3 className="mt-1 line-clamp-2 font-heading text-base leading-6 font-semibold tracking-tight transition-colors group-hover:text-primary">
                        {episode.name}
                      </h3>

                      <p className="mt-auto pt-2 text-sm text-muted-foreground transition-colors group-hover:text-primary/80">
                        {media.title}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing scheduled right now.
          </p>
        </div>
      )}
    </section>
  );
};

export default TvScheduleCarousel;
