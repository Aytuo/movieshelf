'use client';

import { getTvSeasonAction } from '@/lib/actions/tv-action';
import type { TvSeason } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import { ChevronDown, Clock3 } from 'lucide-react';
import { useState } from 'react';

type TvSeasonProps = {
  tvId: number;
  season: TvSeason;
};

function formatEpisodeNumber(
  seasonNumber: number,
  episodeNumber: number
): string {
  return `S${String(seasonNumber).padStart(2, '0')}E${String(
    episodeNumber
  ).padStart(2, '0')}`;
}

function getYear(date: string | null): number | null {
  if (!date) {
    return null;
  }

  const year = Number(date.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

const TvSeason = ({ tvId, season }: TvSeasonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<Awaited<
    ReturnType<typeof getTvSeasonAction>
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  const seasonPoster = tmdbImage(season.posterPath, 'w342');
  const year = getYear(season.airDate);

  async function handleToggle() {
    const nextIsOpen = !isOpen;

    setIsOpen(nextIsOpen);

    if (!nextIsOpen || details !== null || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getTvSeasonAction(tvId, season.seasonNumber);
      setDetails(result);
    } catch {
      setError('Unable to load episodes.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-stretch gap-6 p-4 text-left transition-colors hover:bg-surface-hover sm:gap-7 sm:p-5"
      >
        <div className="w-28 shrink-0 overflow-hidden rounded-xl bg-surface-hover sm:w-32 lg:w-36">
          {seasonPoster ? (
            <img
              src={seasonPoster}
              alt={`${season.name} poster`}
              className="aspect-[2/3] h-full w-full object-cover"
            />
          ) : (
            <div className="aspect-[2/3] w-full" />
          )}
        </div>

        <div className="min-w-0 flex-1 self-center">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <span>Season {season.seasonNumber}</span>

            {year !== null && (
              <>
                <span>•</span>
                <span>{year}</span>
              </>
            )}
          </div>

          <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-2xl">
            {season.name}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {season.episodeCount}{' '}
            {season.episodeCount === 1 ? 'episode' : 'episodes'}
          </p>

          {season.overview && (
            <p className="mt-3 line-clamp-2 hidden max-w-2xl text-sm leading-6 text-muted-foreground sm:block">
              {season.overview}
            </p>
          )}
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center self-center rounded-full border border-border/70 text-muted-foreground">
          <ChevronDown
            className={`size-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-border/60 bg-surface/40">
          <div className="px-4 py-3 sm:px-5">
            <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Episodes
            </p>
          </div>

          {loading && (
            <div className="border-t border-border/60 px-4 py-6 text-sm text-muted-foreground sm:px-5">
              Loading episodes…
            </div>
          )}

          {error && (
            <div className="border-t border-border/60 px-4 py-6 text-sm text-muted-foreground sm:px-5">
              {error}
            </div>
          )}

          {details && details.episodes.length > 0 && (
            <div className="border-t border-border/60">
              {details.episodes.map((episode) => {
                const still = tmdbImage(episode.stillPath, 'w342');

                return (
                  <article
                    key={episode.id}
                    className="group border-b border-border/60 transition-colors last:border-b-0 hover:bg-surface-hover"
                  >
                    <div className="flex gap-4 px-4 py-4 sm:px-5 sm:py-5">
                      {still && (
                        <div className="hidden aspect-video w-48 shrink-0 overflow-hidden rounded-lg bg-surface-hover sm:block">
                          <img
                            src={still}
                            alt=""
                            className="block h-full w-full object-cover"
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-mono text-xs font-medium text-muted-foreground">
                            {formatEpisodeNumber(
                              episode.seasonNumber,
                              episode.episodeNumber
                            )}
                          </span>

                          {episode.airDate && (
                            <span className="text-xs text-muted-foreground">
                              · {episode.airDate}
                            </span>
                          )}
                        </div>

                        <h4 className="mt-1 font-heading text-base font-semibold transition-colors group-hover:text-primary">
                          {episode.name}
                        </h4>

                        {episode.overview && (
                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                            {episode.overview}
                          </p>
                        )}

                        {episode.runtime !== null && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock3 className="size-3.5" />
                            <span>{episode.runtime} min</span>
                          </div>
                        )}
                      </div>

                      <div className="hidden shrink-0 self-start pt-1 text-xs text-muted-foreground md:block">
                        {episode.rating > 0 ? episode.rating.toFixed(1) : '—'}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {details && details.episodes.length === 0 && (
            <div className="border-t border-border/60 px-4 py-6 text-sm text-muted-foreground sm:px-5">
              No episodes available.
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default TvSeason;
