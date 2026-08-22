'use server';

import { requireSession } from '@/lib/auth/require-session';
import { addMovieToShelf } from '@/lib/repositories/user-movie-repository';
import { ensureMovieExists } from '@/lib/services/movie-service';
import { revalidatePath } from 'next/cache';

export async function toggleMovieShelf(movieId: number) {
  const session = await requireSession();

  const movie = await ensureMovieExists(movieId);

  await addMovieToShelf({
    userId: session.user.id,
    movieId: movie.id,
  });

  revalidatePath('/shelf');
  revalidatePath(`/movie/${movieId}`);
}
