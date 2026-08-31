import TastePreview from '@/components/profile/taste-preview';
import { getPublicProfile } from '@/lib/services/profile-service';
import { tmdbImage } from '@/lib/tmdb/images';
import { Film, Star } from 'lucide-react';
import { notFound } from 'next/navigation';

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;

  const data = await getPublicProfile(username);

  if (!data) {
    notFound();
  }

  const { profile, shelf, reviews, taste } = data;

  const movieShelf = shelf.filter(({ media }) => media.type === 'movie');

  const tvShelf = shelf.filter(({ media }) => media.type === 'tv');

  const movieWatched = taste.movie.watched;

  const tvWatched = taste.tv.watched;

  const movieFavorites = movieShelf.filter(
    ({ interaction }) => interaction.favorite
  );

  const tvFavorites = tvShelf.filter(({ interaction }) => interaction.favorite);

  return (
    <main className="container-content py-12 lg:py-16">
      {/* ------------------------------------------------------------------ */}
      {/* Profile header                                                     */}
      {/* ------------------------------------------------------------------ */}

      <header className="border-b border-border/60 pb-10">
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface text-2xl font-bold">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              profile.username.slice(0, 1).toUpperCase()
            )}
          </div>

          <div>
            <p className="eyebrow">MovieShelf profile</p>

            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
              {profile.displayName || `@${profile.username}`}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              @{profile.username}
            </p>

            {profile.bio && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Media statistics                                                 */}
        {/* ---------------------------------------------------------------- */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl p-5 surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="size-4 text-primary" />

                <p className="text-sm font-semibold">Movies</p>
              </div>

              <span className="text-xs text-muted-foreground">
                {taste.movie.total} total
              </span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <div>
                <p className="text-2xl font-bold">{movieWatched}</p>

                <p className="mt-1 text-xs text-muted-foreground">watched</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{taste.movie.rated}</p>

                <p className="mt-1 text-xs text-muted-foreground">rated</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{movieFavorites.length}</p>

                <p className="mt-1 text-xs text-muted-foreground">favorites</p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-current text-rating" />

                  <p className="text-2xl font-bold">
                    {taste.movie.averageRating ?? '—'}
                  </p>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">average</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl p-5 surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="size-4 text-primary" />

                <p className="text-sm font-semibold">TV Series</p>
              </div>

              <span className="text-xs text-muted-foreground">
                {taste.tv.total} total
              </span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <div>
                <p className="text-2xl font-bold">{tvWatched}</p>

                <p className="mt-1 text-xs text-muted-foreground">watched</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{taste.tv.rated}</p>

                <p className="mt-1 text-xs text-muted-foreground">rated</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{tvFavorites.length}</p>

                <p className="mt-1 text-xs text-muted-foreground">favorites</p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <Star className="size-3.5 fill-current text-rating" />

                  <p className="text-2xl font-bold">
                    {taste.tv.averageRating ?? '—'}
                  </p>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">average</p>
              </div>
            </div>
          </section>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Favorites                                                          */}
      {/* ------------------------------------------------------------------ */}

      <section className="py-12">
        <div className="mb-7">
          <p className="eyebrow">From the shelf</p>

          <h2 className="mt-2 font-heading text-2xl font-bold">Favorites</h2>
        </div>

        {movieFavorites.length + tvFavorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {[...movieFavorites, ...tvFavorites]
              .slice(0, 6)
              .map(({ media }) => {
                const poster = tmdbImage(media.posterPath, 'w500');

                return (
                  <div key={`${media.type}:${media.tmdbId}`}>
                    {poster && (
                      <img
                        src={poster}
                        alt={media.title}
                        className="aspect-[2/3] w-full rounded-xl object-cover"
                      />
                    )}

                    <div className="mt-2">
                      <p className="line-clamp-1 text-sm font-medium">
                        {media.title}
                      </p>

                      <p className="mt-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                        {media.type === 'movie' ? 'Movie' : 'TV Series'}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No favorites yet.</p>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Taste                                                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-border/60 py-12">
        <div className="mb-7">
          <p className="eyebrow">Cinematic identity</p>

          <h2 className="mt-2 font-heading text-2xl font-bold">Your Taste</h2>
        </div>

        <TastePreview taste={taste} username={profile.username} />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Reviews                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-t border-border/60 py-12">
        <div className="mb-7">
          <p className="eyebrow">Words</p>

          <h2 className="mt-2 font-heading text-2xl font-bold">Reviews</h2>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.slice(0, 6).map(({ review, media }) => (
              <article key={review.id} className="rounded-2xl p-5 surface">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{media.title}</p>

                  <span className="text-[10px] tracking-wide text-muted-foreground/70 uppercase">
                    {media.type === 'movie' ? 'Movie' : 'TV Series'}
                  </span>
                </div>

                {review.title && (
                  <h3 className="mt-2 font-heading text-lg font-semibold">
                    {review.title}
                  </h3>
                )}

                <p className="mt-3 line-clamp-4 text-sm leading-6 text-muted-foreground">
                  {review.content}
                </p>

                {review.rating !== null && (
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
