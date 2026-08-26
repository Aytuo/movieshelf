import { db } from '@/lib/db';
import { userMovie, watchHistory } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

export async function addToWatchlist(userId: string, movieId: string) {
  await db
    .insert(userMovie)
    .values({
      userId,
      movieId,
      status: 'watchlist',
    })
    .onConflictDoNothing();
}

export async function removeFromShelf(userId: string, movieId: string) {
  await db
    .delete(userMovie)
    .where(and(eq(userMovie.userId, userId), eq(userMovie.movieId, movieId)));
}

export async function markAsWatched(userId: string, movieId: string) {
  const watchedAt = new Date();

  await db.transaction(async (tx) => {
    await tx
      .insert(userMovie)
      .values({
        userId,
        movieId,
        status: 'watched',
        watchedAt,
      })
      .onConflictDoUpdate({
        target: [userMovie.userId, userMovie.movieId],
        set: {
          status: 'watched',
          watchedAt,
          updatedAt: watchedAt,
        },
      });

    await tx.insert(watchHistory).values({
      id: crypto.randomUUID(),
      userId,
      movieId,
      watchedAt,
    });
  });
}

export async function toggleFavorite(userId: string, movieId: string) {
  const existing = await db
    .select({
      favorite: userMovie.favorite,
    })
    .from(userMovie)
    .where(and(eq(userMovie.userId, userId), eq(userMovie.movieId, movieId)))
    .limit(1);

  if (!existing[0]) {
    await db.insert(userMovie).values({
      userId,
      movieId,
      status: 'watchlist',
      favorite: true,
    });

    return true;
  }

  const nextValue = !existing[0].favorite;

  await db
    .update(userMovie)
    .set({
      favorite: nextValue,
      updatedAt: new Date(),
    })
    .where(and(eq(userMovie.userId, userId), eq(userMovie.movieId, movieId)));

  return nextValue;
}

export async function setRating(
  userId: string,
  movieId: string,
  rating: number
) {
  await db
    .insert(userMovie)
    .values({
      userId,
      movieId,
      status: 'watched',
      rating,
      watchedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userMovie.userId, userMovie.movieId],
      set: {
        status: 'watched',
        rating,
        watchedAt: new Date(),
        updatedAt: new Date(),
      },
    });
}
