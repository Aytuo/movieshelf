import ProfileNavbar from '@/components/profile/profile-navbar';
import { getPublicProfile } from '@/lib/services/profile-service';
import { tmdbImage } from '@/lib/tmdb/images';
import { Film, Heart, Star } from 'lucide-react';
import Link from 'next/link';
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

  const { profile, stats, favorites } = data;

  return (
    <main className="container-content py-12 lg:py-16">
      {/* Profile header */}
      <header>
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

            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
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

        <div className="mt-8">
          <ProfileNavbar username={profile.username} />
        </div>
      </header>

      {/* Statistics */}
      <section className="py-10 lg:py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Movies */}
          <section className="rounded-2xl p-5 surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="size-4 text-primary" />

                <p className="text-sm font-semibold">Movies</p>
              </div>

              <span className="text-xs text-muted-foreground">
                {stats.movies.total} total
              </span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <div>
                <p className="text-2xl font-bold">{stats.movies.watched}</p>

                <p className="mt-1 text-xs text-muted-foreground">watched</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{stats.movies.rated}</p>

                <p className="mt-1 text-xs text-muted-foreground">rated</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{stats.movies.favorites}</p>

                <p className="mt-1 text-xs text-muted-foreground">favorites</p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  {stats.movies.averageRating !== null && (
                    <Star className="size-3.5 fill-current text-rating" />
                  )}

                  <p className="text-2xl font-bold">
                    {stats.movies.averageRating ?? '—'}
                  </p>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">average</p>
              </div>
            </div>
          </section>

          {/* TV Series */}
          <section className="rounded-2xl p-5 surface">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="size-4 text-primary" />

                <p className="text-sm font-semibold">TV Series</p>
              </div>

              <span className="text-xs text-muted-foreground">
                {stats.tv.total} total
              </span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <div>
                <p className="text-2xl font-bold">{stats.tv.watched}</p>

                <p className="mt-1 text-xs text-muted-foreground">watched</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{stats.tv.rated}</p>

                <p className="mt-1 text-xs text-muted-foreground">rated</p>
              </div>

              <div>
                <p className="text-2xl font-bold">{stats.tv.favorites}</p>

                <p className="mt-1 text-xs text-muted-foreground">favorites</p>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  {stats.tv.averageRating !== null && (
                    <Star className="size-3.5 fill-current text-rating" />
                  )}

                  <p className="text-2xl font-bold">
                    {stats.tv.averageRating ?? '—'}
                  </p>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">average</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Favorites */}
      <section className="py-10 lg:py-14">
        <div className="mb-7">
          <p className="eyebrow">From the shelf</p>

          <h2 className="mt-2 font-heading text-2xl font-bold">Favorites</h2>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {favorites.map(({ media }) => {
              const poster = tmdbImage(media.posterPath, 'w500');

              const href =
                media.type === 'movie'
                  ? `/movie/${media.tmdbId}`
                  : `/tv/${media.tmdbId}`;

              return (
                <Link
                  key={`${media.type}:${media.tmdbId}`}
                  href={href}
                  className="group"
                >
                  <article>
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                      {poster ? (
                        <img
                          src={poster}
                          alt={`${media.title} poster`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-sm text-muted-foreground">
                          No poster
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <p className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-primary">
                        {media.title}
                      </p>

                      <p className="mt-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                        {media.type === 'movie' ? 'Movie' : 'TV Series'}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-12 text-center surface">
            <Heart className="mx-auto size-6 text-muted-foreground" />

            <h3 className="mt-4 font-heading text-xl font-semibold">
              No favorites yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Favorite movies and TV series will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
