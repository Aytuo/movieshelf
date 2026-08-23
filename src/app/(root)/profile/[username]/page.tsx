import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { getUserReviews } from '@/lib/repositories/review-repository';
import { getUserShelf } from '@/lib/repositories/user-movie-repository';
import { tmdbImage } from '@/lib/tmdb/images';
import { eq } from 'drizzle-orm';
import { Bookmark, Film, Heart, Star } from 'lucide-react';
import { notFound } from 'next/navigation';

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;

  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.username, username))
    .limit(1);

  const userProfile = result[0];

  if (!userProfile) {
    notFound();
  }

  const shelf = await getUserShelf(userProfile.userId);

  const reviews = await getUserReviews(userProfile.userId);

  const watched = shelf.filter(({ shelf }) => shelf.status === 'watched');

  const favorites = shelf.filter(({ shelf }) => shelf.favorite);

  const ratings = shelf
    .map(({ shelf }) => shelf.rating)
    .filter((rating): rating is number => rating !== null);

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        ).toFixed(1)
      : '—';

  return (
    <main className="container-content py-12 lg:py-16">
      <header className="border-b border-border/60 pb-10">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface text-2xl font-bold">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              userProfile.username.slice(0, 1).toUpperCase()
            )}
          </div>

          <div>
            <p className="eyebrow">MovieShelf profile</p>

            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
              {userProfile.displayName || `@${userProfile.username}`}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              @{userProfile.username}
            </p>

            {userProfile.bio && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                {userProfile.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl p-4 surface">
            <Film className="size-4 text-primary" />

            <p className="mt-4 text-2xl font-bold">{watched.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">watched</p>
          </div>

          <div className="rounded-xl p-4 surface">
            <Bookmark className="size-4 text-primary" />

            <p className="mt-4 text-2xl font-bold">{shelf.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">on shelf</p>
          </div>

          <div className="rounded-xl p-4 surface">
            <Heart className="size-4 text-primary" />

            <p className="mt-4 text-2xl font-bold">{favorites.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">favorites</p>
          </div>

          <div className="rounded-xl p-4 surface">
            <Star className="size-4 text-rating" />

            <p className="mt-4 text-2xl font-bold">{averageRating}</p>

            <p className="mt-1 text-xs text-muted-foreground">average rating</p>
          </div>
        </div>
      </header>

      <section className="py-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">From the shelf</p>

            <h2 className="mt-2 font-heading text-2xl font-bold">Favorites</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {favorites.slice(0, 6).map(({ movie }) => {
            const poster = tmdbImage(movie.posterPath, 'w500');

            return (
              <div key={movie.id}>
                {poster && (
                  <img
                    src={poster}
                    alt={movie.title}
                    className="aspect-[2/3] w-full rounded-xl object-cover"
                  />
                )}

                <p className="mt-2 line-clamp-1 text-sm font-medium">
                  {movie.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border/60 py-12">
        <div className="mb-7">
          <p className="eyebrow">Words</p>

          <h2 className="mt-2 font-heading text-2xl font-bold">Reviews</h2>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.slice(0, 6).map(({ review, movie }) => (
              <article key={review.id} className="rounded-2xl p-5 surface">
                <p className="text-xs text-muted-foreground">{movie.title}</p>

                {review.title && (
                  <h3 className="mt-2 font-heading text-lg font-semibold">
                    {review.title}
                  </h3>
                )}

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {review.content}
                </p>

                {review.rating && (
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rating">
                    <Star className="size-3.5 fill-current" />
                    {review.rating}/10
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
