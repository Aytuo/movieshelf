'use client';

import { toggleMovieShelf } from '@/lib/actions/movie.action';
import { Bookmark } from 'lucide-react';
import { useTransition } from 'react';

type AddToShelfButtonProps = {
  movieId: number;
};

const AddToShelfButton = ({ movieId }: AddToShelfButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          toggleMovieShelf(movieId);
        });
      }}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Bookmark className="size-4" />

      {isPending ? 'Adding...' : 'Add to shelf'}
    </button>
  );
};

export default AddToShelfButton;
