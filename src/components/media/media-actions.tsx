'use client';

import {
  addMediaToWatchlist,
  markMediaAsDropped,
  markMediaAsWatched,
  rateMedia,
  removeMediaFromShelf,
  startMediaWatching,
  toggleMediaFavorite,
} from '@/lib/actions/media-interaction.action';
import type { MediaType } from '@/lib/media';
import {
  Bookmark,
  Check,
  Clock3,
  Heart,
  Play,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useState, useTransition } from 'react';

type MediaStatus = 'watchlist' | 'watching' | 'watched' | 'dropped' | null;

type MediaActionsState = {
  inShelf: boolean;
  status: MediaStatus;
  favorite: boolean;
  rating: number | null;
  watchNumber: number | null;
};

type MediaActionsProps = {
  type: MediaType;
  tmdbId: number;
  initialState: MediaActionsState;
};

const MediaActions = ({ type, tmdbId, initialState }: MediaActionsProps) => {
  const [state, setState] = useState<MediaActionsState>(initialState);

  const [isPending, startTransition] = useTransition();

  const mediaLabel = type === 'movie' ? 'movie' : 'TV series';

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
      } catch (error) {
        console.error(error);
      }
    });
  }

  function updateState(updates: Partial<MediaActionsState>) {
    setState((current) => ({
      ...current,
      ...updates,
    }));
  }

  function handleAddToWatchlist() {
    run(async () => {
      await addMediaToWatchlist(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'watchlist',
      });
    });
  }

  function handleStartWatching() {
    run(async () => {
      await startMediaWatching(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'watching',
      });
    });
  }

  function handleMarkAsWatched() {
    run(async () => {
      const watchNumber = await markMediaAsWatched(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'watched',
        watchNumber,
      });
    });
  }

  function handleMarkAsDropped() {
    run(async () => {
      await markMediaAsDropped(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'dropped',
      });
    });
  }

  function handleRemoveFromShelf() {
    run(async () => {
      await removeMediaFromShelf(type, tmdbId);

      updateState({
        inShelf: false,
        status: null,
        favorite: false,
        rating: null,
        watchNumber: null,
      });
    });
  }

  function handleToggleFavorite() {
    run(async () => {
      await toggleMediaFavorite(type, tmdbId);

      updateState({
        inShelf: true,
        favorite: !state.favorite,
      });
    });
  }

  function handleRating(rating: number) {
    run(async () => {
      await rateMedia(type, tmdbId, rating);

      updateState({
        inShelf: true,
        status: 'watched',
        rating,
      });
    });
  }

  function getWatchLabel() {
    if (state.watchNumber === null) {
      return null;
    }

    return state.watchNumber === 1
      ? 'First watch · Watch #1'
      : `Rewatch #${state.watchNumber - 1}`;
  }

  return (
    <div className="space-y-5">
      {/* Current status */}
      {state.status !== null && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            {state.status === 'watchlist' && (
              <>
                <Bookmark className="size-4 text-primary" />
                <span className="font-medium">On your watchlist</span>
              </>
            )}

            {state.status === 'watching' && (
              <>
                <Clock3 className="size-4 text-primary" />
                <span className="font-medium">Currently watching</span>
              </>
            )}

            {state.status === 'watched' && (
              <>
                <Check className="size-4 text-primary" />
                <span className="font-medium">Watched</span>
              </>
            )}

            {state.status === 'dropped' && (
              <>
                <X className="size-4 text-muted-foreground" />
                <span className="font-medium">Dropped</span>
              </>
            )}
          </div>

          {state.status === 'watched' && state.watchNumber !== null && (
            <p className="ml-6 text-xs text-muted-foreground">
              {getWatchLabel()}
            </p>
          )}
        </div>
      )}

      {/* Primary actions */}
      <div className="flex flex-wrap gap-3">
        {state.status === null && (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={handleAddToWatchlist}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Bookmark className="size-4" />
              Add to watchlist
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleMarkAsWatched}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="size-4" />
              Mark as watched
            </button>
          </>
        )}

        {state.status === 'watchlist' && (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={handleStartWatching}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="size-4" />
              Start watching
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleMarkAsWatched}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="size-4" />
              Mark as watched
            </button>
          </>
        )}

        {state.status === 'watching' && (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={handleMarkAsWatched}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="size-4" />
              Mark as watched
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleMarkAsDropped}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-4" />
              Drop
            </button>
          </>
        )}

        {state.status === 'watched' && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleMarkAsWatched}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-4" />
            Watch again
          </button>
        )}

        {state.status === 'dropped' && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleStartWatching}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-4" />
            Start watching
          </button>
        )}

        {state.inShelf && (
          <button
            type="button"
            disabled={isPending}
            onClick={handleRemoveFromShelf}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Remove from shelf
          </button>
        )}

        <button
          type="button"
          disabled={isPending}
          onClick={handleToggleFavorite}
          aria-pressed={state.favorite}
          className={[
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            state.favorite
              ? 'border-primary/30 bg-primary-muted text-primary'
              : 'border-border bg-surface hover:bg-surface-hover',
          ].join(' ')}
        >
          <Heart
            className="size-4"
            fill={state.favorite ? 'currentColor' : 'none'}
          />
          Favorite
        </button>
      </div>

      {/* Rating */}
      <div className="border-t border-border/60 pt-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          Your rating
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <button
              key={value}
              type="button"
              disabled={isPending}
              onClick={() => handleRating(value)}
              aria-label={`Rate ${mediaLabel} ${value} out of 10`}
              className={[
                'flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all',
                state.rating === value
                  ? 'border-rating/40 bg-rating-muted text-rating'
                  : 'border-border bg-surface text-muted-foreground hover:border-rating/30 hover:text-rating',
              ].join(' ')}
            >
              {value}
            </button>
          ))}
        </div>

        {state.rating !== null && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rating">
            <Star className="size-4 fill-current" />
            You rated this {state.rating}/10
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaActions;
