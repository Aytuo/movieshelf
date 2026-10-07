'use client';

import {
  addMediaToWatchlist,
  markMediaAsDropped,
  markMediaAsWatched,
  rateMedia,
  removeMediaFromShelf,
  startMediaWatching,
  toggleMediaFavorite,
} from '@/lib/actions/media-interaction-action';
import type { MediaDetails } from '@/lib/media';
import {
  canMarkAsWatched,
  canStartWatching,
} from '@/lib/media/media-status-policy';
import { cn } from '@/lib/utils';
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
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

type MediaStatus = 'watchlist' | 'watching' | 'watched' | 'dropped' | null;

type MediaActionsState = {
  inShelf: boolean;
  status: MediaStatus;
  favorite: boolean;
  rating: number | null;
  watchNumber: number | null;
};

type MediaActionsProps = {
  media: MediaDetails;
  initialState: MediaActionsState;
};

const MediaActions = ({ media, initialState }: MediaActionsProps) => {
  const router = useRouter();

  const [state, setState] = useState<MediaActionsState>(initialState);
  const [isPending, startTransition] = useTransition();

  const { type, tmdbId } = media;

  const canWatch = canStartWatching(media);
  const canMarkWatched = canMarkAsWatched(media);

  const mediaLabel = type === 'movie' ? 'movie' : 'TV series';

  function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
  }

  function run(
    action: () => Promise<void>,
    successMessage: string,
    errorMessage = "Couldn't update your shelf. Please try again."
  ) {
    startTransition(async () => {
      try {
        await action();
        toast.success(successMessage);
      } catch (error) {
        console.error(error);

        toast.error(getErrorMessage(error, errorMessage));
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
    }, 'Added to your watchlist.');
  }

  function handleStartWatching() {
    run(async () => {
      await startMediaWatching(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'watching',
      });
    }, 'Started watching.');
  }

  function handleMarkAsWatched() {
    run(async () => {
      const watchNumber = await markMediaAsWatched(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'watched',
        watchNumber,
      });
    }, 'Marked as watched.');
  }

  function handleMarkAsDropped() {
    run(async () => {
      await markMediaAsDropped(type, tmdbId);

      updateState({
        inShelf: true,
        status: 'dropped',
      });
    }, 'Marked as dropped.');
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
    }, 'Removed from your shelf.');
  }

  function handleToggleFavorite() {
    const nextFavorite = !state.favorite;

    run(
      async () => {
        await toggleMediaFavorite(type, tmdbId);

        updateState({
          inShelf: true,
          favorite: nextFavorite,
        });
      },
      nextFavorite ? 'Added to favorites.' : 'Removed from favorites.'
    );
  }

  function handleRating(rating: number) {
    run(async () => {
      await rateMedia(type, tmdbId, rating);

      updateState({
        inShelf: true,
        status: 'watched',
        rating,
      });

      router.refresh();
    }, 'Rating saved.');
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
            <Button
              type="button"
              size="lg"
              disabled={isPending}
              onClick={handleAddToWatchlist}
              className="h-10 px-4 hover:bg-primary-hover"
            >
              <Bookmark className="size-4" />
              Add to watchlist
            </Button>

            {canMarkWatched && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isPending}
                onClick={handleMarkAsWatched}
                className="h-10 border-border bg-surface hover:bg-surface-hover"
              >
                <Check className="size-4" />
                Mark as watched
              </Button>
            )}
          </>
        )}

        {state.status === 'watchlist' && (
          <>
            {canWatch && (
              <Button
                type="button"
                size="lg"
                disabled={isPending}
                onClick={handleStartWatching}
                className="h-10 px-4 hover:bg-primary-hover"
              >
                <Play className="size-4" />
                Start watching
              </Button>
            )}

            {canMarkWatched && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                disabled={isPending}
                onClick={handleMarkAsWatched}
                className="h-10 border-border bg-surface hover:bg-surface-hover"
              >
                <Check className="size-4" />
                Mark as watched
              </Button>
            )}
          </>
        )}

        {state.status === 'watching' && (
          <>
            {canMarkWatched && (
              <Button
                type="button"
                size="lg"
                disabled={isPending}
                onClick={handleMarkAsWatched}
                className="h-10 px-4 hover:bg-primary-hover"
              >
                <Check className="size-4" />
                Mark as watched
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isPending}
              onClick={handleMarkAsDropped}
              className="h-10 border-border bg-surface hover:bg-surface-hover"
            >
              <X className="size-4" />
              Drop
            </Button>
          </>
        )}

        {state.status === 'watched' && (
          <Button
            type="button"
            size="lg"
            disabled={isPending}
            onClick={handleMarkAsWatched}
            className="h-10 px-4 hover:bg-primary-hover"
          >
            <Play className="size-4" />
            Watch again
          </Button>
        )}

        {state.status === 'dropped' && canWatch && (
          <Button
            type="button"
            size="lg"
            disabled={isPending}
            onClick={handleStartWatching}
            className="h-10 px-4 hover:bg-primary-hover"
          >
            <Play className="size-4" />
            Start watching
          </Button>
        )}

        {state.inShelf && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isPending}
            onClick={handleRemoveFromShelf}
            className="h-10 border-border bg-surface hover:bg-surface-hover"
          >
            <Trash2 className="size-4" />
            Remove from shelf
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isPending}
          onClick={handleToggleFavorite}
          aria-pressed={state.favorite}
          className={cn(
            'h-10 px-4',
            state.favorite
              ? 'border-primary/30 bg-primary-muted text-primary hover:bg-primary-muted'
              : 'border-border bg-surface hover:bg-surface-hover'
          )}
        >
          <Heart
            className="size-4"
            fill={state.favorite ? 'currentColor' : 'none'}
          />
          Favorite
        </Button>
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
              className={cn(
                'flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-all',
                state.rating === value
                  ? 'border-rating/40 bg-rating-muted text-rating'
                  : 'border-border bg-surface text-muted-foreground hover:border-rating/30 hover:text-rating'
              )}
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
