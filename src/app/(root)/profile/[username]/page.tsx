import { FollowButton } from '@/components/follow/follow-button';
import { ProfileMediaShelf } from '@/components/profile/profile-media-shelf';
import ProfileNavbar from '@/components/profile/profile-navbar';
import { requireSession } from '@/lib/auth/require-session';
import { getPublicProfile } from '@/lib/services/profile-service';
import { Film, Heart, History, Star, Tv } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Profile',
  description: 'View and manage your MovieShelf profile.',
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;

  const session = await requireSession();

  const viewerUserId = session.user.id;

  const data = await getPublicProfile(username, viewerUserId);

  if (!data) {
    notFound();
  }

  const { profile, stats, favorites, latestRated, followStats } = data;

  return (
    <main className="container-content py-12 lg:py-16">
      {/* Profile header */}
      <header>
        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 items-end gap-5">
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

            <div className="min-w-0">
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

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <Link
                  href={`/profile/${profile.username}/followers`}
                  className="transition-colors hover:text-foreground"
                >
                  <strong className="font-semibold text-foreground">
                    {followStats.followerCount}
                  </strong>{' '}
                  {followStats.followerCount === 1 ? 'follower' : 'followers'}
                </Link>

                <Link
                  href={`/profile/${profile.username}/following`}
                  className="transition-colors hover:text-foreground"
                >
                  <strong className="font-semibold text-foreground">
                    {followStats.followingCount}
                  </strong>{' '}
                  following
                </Link>
              </div>
            </div>
          </div>

          {viewerUserId !== profile.userId && (
            <FollowButton
              followingId={profile.userId}
              initialFollowing={followStats.viewerIsFollowing}
            />
          )}
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
                <Tv className="size-4 text-primary" />

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

      <ProfileMediaShelf
        eyebrow="From the shelf"
        title="Favorites"
        items={favorites}
        emptyTitle="No favorites yet"
        emptyDescription="Favorite movies and TV series will appear here."
        emptyIcon={Heart}
      />

      <ProfileMediaShelf
        eyebrow="Latest"
        title="Recently rated"
        items={latestRated}
        emptyTitle="No ratings yet"
        emptyDescription="Movies and TV series you rate will appear here."
        emptyIcon={History}
      />
    </main>
  );
};

export default ProfilePage;
