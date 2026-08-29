'use client';

import { Bookmark, Check, Heart, Star, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import {
  addMovieToWatchlist,
  markMovieAsWatched,
  rateMovie,
  removeMovieFromShelf,
  toggleMovieFavorite,
} from '@/lib/actions/media-interaction.action';

type MovieActionsProps = {
  movieId: number;

  initialState: {
    inShelf: boolean;
    status: 'watchlist' | 'watched' | null;
    favorite: boolean;
    rating: number | null;
  };
};

const MovieActions = ({ movieId, initialState }: MovieActionsProps) => {
  const [state, setState] = useState(initialState);

  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {state.inShelf ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              run(async () => {
                await removeMovieFromShelf(movieId);

                setState({
                  ...state,
                  inShelf: false,
                  status: null,
                  favorite: false,
                  rating: null,
                });
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Remove from shelf
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              run(async () => {
                await addMovieToWatchlist(movieId);

                setState({
                  ...state,
                  inShelf: true,
                  status: 'watchlist',
                });
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Bookmark className="size-4" />
            Add to watchlist
          </button>
        )}

        {!state.inShelf || state.status === 'watchlist' ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              run(async () => {
                await markMovieAsWatched(movieId);

                setState({
                  ...state,
                  inShelf: true,
                  status: 'watched',
                });
              });
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            <Check className="size-4" />

            {state.status === 'watched' ? 'Watched again' : 'Mark as watched'}
          </button>
        ) : null}

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            run(async () => {
              await toggleMovieFavorite(movieId);

              setState({
                ...state,
                inShelf: true,
                favorite: !state.favorite,
              });
            });
          }}
          className={[
            'inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50',
            state.favorite
              ? 'border-primary/30 bg-primary-muted text-primary'
              : 'border-border bg-surface hover:bg-surface-hover',
          ].join(' ')}
        >
          <Heart
            className="size-4"
            fill={state.favorite ? 'currentColor' : 'none'}
          />

          {state.favorite ? 'Favorite' : 'Favorite'}
        </button>
      </div>

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
              onClick={() => {
                run(async () => {
                  await rateMovie(movieId, value);

                  setState({
                    ...state,
                    inShelf: true,
                    status: 'watched',
                    rating: value,
                  });
                });
              }}
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

        {state.rating && (
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rating">
            <Star className="size-4 fill-current" />
            You rated this {state.rating}/10
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieActions;
