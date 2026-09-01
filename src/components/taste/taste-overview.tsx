'use client';

import { getTasteSummary } from '@/lib/taste/taste-summary';
import type { TasteProfile, TasteStats } from '@/types';
import { Star } from 'lucide-react';
import { useState } from 'react';

type TasteOverviewProps = {
  taste: TasteProfile;
};

type TasteType = 'movie' | 'tv';

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-4 surface">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>

      <p className="mt-4 font-heading text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}

const TasteOverview = ({ taste }: TasteOverviewProps) => {
  const [type, setType] = useState<TasteType>('movie');

  const stats: TasteStats = type === 'movie' ? taste.movie : taste.tv;

  const summary = getTasteSummary(stats, type);

  const maxRatingCount = Math.max(
    ...stats.ratingDistribution.map((item) => item.count),
    1
  );

  const tasteProgress = Math.min(stats.watched / 50, 1);

  const label = type === 'movie' ? 'movies' : 'TV series';

  return (
    <div className="space-y-6">
      {/* Media type selector */}
      <section className="flex justify-center">
        <div className="inline-flex rounded-lg border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setType('movie')}
            aria-pressed={type === 'movie'}
            className={[
              'rounded-md px-4 py-2 text-xs font-semibold transition-colors',
              type === 'movie'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            Movies
          </button>

          <button
            type="button"
            onClick={() => setType('tv')}
            aria-pressed={type === 'tv'}
            className={[
              'rounded-md px-4 py-2 text-xs font-semibold transition-colors',
              type === 'tv'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            TV Series
          </button>
        </div>
      </section>

      {/* Summary */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary-muted p-6 sm:p-8">
        <div className="pointer-events-none absolute top-[-35%] right-[-10%] size-72 rounded-full bg-primary/10 blur-[90px]" />

        <div className="relative">
          <p className="eyebrow">Your cinematic fingerprint</p>

          <h2 className="mt-4 max-w-2xl font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {summary.title}
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {summary.description}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Watched" value={stats.watched} />

        <Stat label="Rated" value={stats.rated} />

        <Stat label="Favorites" value={stats.favorite} />

        <Stat
          label="Average"
          value={stats.averageRating ?? '—'}
          icon={
            stats.averageRating !== null ? (
              <Star className="size-3.5 fill-current text-rating" />
            ) : undefined
          }
        />
      </section>

      {/* Taste profile maturity */}
      <section className="rounded-2xl p-6 surface">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Taste profile</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {stats.watched < 10
                ? `Your ${type === 'movie' ? 'cinematic' : 'TV'} identity is just getting started.`
                : stats.watched < 30
                  ? "We're starting to see your patterns."
                  : 'Your taste is becoming very distinctive.'}
            </p>
          </div>

          <span className="text-xs text-muted-foreground">
            {stats.watched} {label}
          </span>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-hover">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${tasteProgress * 100}%`,
            }}
          />
        </div>
      </section>

      {/* Genres + decades */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl p-6 surface">
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Top genres
          </p>

          <div className="mt-7 space-y-4">
            {stats.topGenres.length > 0 ? (
              stats.topGenres.map((genre) => (
                <div key={genre.name}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium">{genre.name}</span>

                    <span className="text-muted-foreground">
                      {genre.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-700"
                      style={{
                        width: `${genre.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                {type === 'movie'
                  ? 'Rate a few movies to see your favorite genres.'
                  : 'Rate a few TV series to see your favorite genres.'}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl p-6 surface">
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Favorite decades
          </p>

          <div className="mt-7 space-y-4">
            {stats.favoriteDecades.length > 0 ? (
              stats.favoriteDecades.map((decade) => (
                <div key={decade.decade}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                    <span className="font-medium">{decade.decade}</span>

                    <span className="text-muted-foreground">
                      {decade.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{
                        width: `${decade.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Your favorite eras will appear here.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Rating distribution */}
      <section className="rounded-2xl p-6 surface sm:p-7">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
            Rating distribution
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            How you score the {label} you watch.
          </p>
        </div>

        <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
          {stats.ratingDistribution.map((item) => {
            const height =
              item.count === 0
                ? 4
                : Math.max((item.count / maxRatingCount) * 100, 10);

            return (
              <div
                key={item.rating}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <div className="group relative flex flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/70 transition-[height,background-color] duration-300 group-hover:bg-primary"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>

                <span className="mt-2 text-center text-[10px] text-muted-foreground">
                  {item.rating}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TasteOverview;
