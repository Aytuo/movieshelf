import { requireSession } from '@/lib/auth/require-session';
import { getUserShelf } from '@/lib/services/media-interaction-service';
import { tmdbImage } from '@/lib/tmdb/images';
import {
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Heart,
  Star,
  X,
} from 'lucide-react';
import Link from 'next/link';

type ShelfFilter =
  'all' | 'watchlist' | 'watching' | 'watched' | 'dropped' | 'favorites';

type ShelfPageProps = {
  searchParams: Promise<{
    filter?: ShelfFilter;
  }>;
};

const ShelfPage = async ({ searchParams }: ShelfPageProps) => {
  const session = await requireSession();

  const { filter = 'all' } = await searchParams;

  const shelf = await getUserShelf(session.user.id);

  const filtered = shelf.filter(({ interaction }) => {
    if (filter === 'watchlist') {
      return interaction.status === 'watchlist';
    }

    if (filter === 'watching') {
      return interaction.status === 'watching';
    }

    if (filter === 'watched') {
      return interaction.status === 'watched';
    }

    if (filter === 'dropped') {
      return interaction.status === 'dropped';
    }

    if (filter === 'favorites') {
      return interaction.favorite;
    }

    return true;
  });

  const counts = {
    all: shelf.length,

    watchlist: shelf.filter(
      ({ interaction }) => interaction.status === 'watchlist'
    ).length,

    watching: shelf.filter(
      ({ interaction }) => interaction.status === 'watching'
    ).length,

    watched: shelf.filter(({ interaction }) => interaction.status === 'watched')
      .length,

    dropped: shelf.filter(({ interaction }) => interaction.status === 'dropped')
      .length,

    favorites: shelf.filter(({ interaction }) => interaction.favorite).length,
  };

  const filters = [
    {
      label: 'All',
      value: 'all' as const,
      count: counts.all,
      icon: Bookmark,
    },
    {
      label: 'Watchlist',
      value: 'watchlist' as const,
      count: counts.watchlist,
      icon: Bookmark,
    },
    {
      label: 'Watching',
      value: 'watching' as const,
      count: counts.watching,
      icon: Clock3,
    },
    {
      label: 'Watched',
      value: 'watched' as const,
      count: counts.watched,
      icon: Check,
    },
    {
      label: 'Dropped',
      value: 'dropped' as const,
      count: counts.dropped,
      icon: X,
    },
    {
      label: 'Favorites',
      value: 'favorites' as const,
      count: counts.favorites,
      icon: Heart,
    },
  ];

  const emptyTitle =
    filter === 'all'
      ? 'Your shelf is empty'
      : filter === 'watchlist'
        ? 'Your watchlist is empty'
        : filter === 'watching'
          ? 'You are not watching anything'
          : filter === 'watched'
            ? 'You have no watched media yet'
            : filter === 'dropped'
              ? 'You have no dropped media yet'
              : 'You have no favorites yet';

  const emptyDescription =
    filter === 'all'
      ? 'Discover movies and TV series and give the ones that matter a place on your shelf.'
      : 'Discover movies and TV series and build your collection from there.';

  return (
    <main className="container-content py-12 lg:py-16">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your collection</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            My Shelf
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Everything you&apos;ve decided deserves a place in your personal
            collection.
          </p>
        </div>

        <Link
          href="/activity"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Activity
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* Shelf content */}
      <section className="py-10 lg:py-14">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {filters
              .filter((item) => item.value !== 'favorites')
              .map((item) => {
                const Icon = item.icon;

                const active = filter === item.value;

                return (
                  <Link
                    key={item.value}
                    href={
                      item.value === 'all'
                        ? '/shelf'
                        : `/shelf?filter=${item.value}`
                    }
                    className={[
                      'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary/30 bg-primary-muted text-primary'
                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground',
                    ].join(' ')}
                  >
                    <Icon className="size-3.5" />

                    {item.label}

                    <span className="text-xs opacity-60">{item.count}</span>
                  </Link>
                );
              })}
          </div>

          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

          {filters
            .filter((item) => item.value === 'favorites')
            .map((item) => {
              const Icon = item.icon;

              const active = filter === item.value;

              return (
                <Link
                  key={item.value}
                  href="/shelf?filter=favorites"
                  className={[
                    'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary/30 bg-primary-muted text-primary'
                      : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground',
                  ].join(' ')}
                >
                  <Icon className="size-3.5" />

                  {item.label}

                  <span className="text-xs opacity-60">{item.count}</span>
                </Link>
              );
            })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-12 text-center surface">
            <Bookmark className="mx-auto size-6 text-muted-foreground" />

            <h2 className="mt-4 font-heading text-xl font-semibold">
              {emptyTitle}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {emptyDescription}
            </p>

            <Link
              href="/discover"
              className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Discover
            </Link>
          </div>
        ) : (
          /* Media grid */
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map(({ media, interaction }) => {
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
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No poster
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {interaction.favorite && (
                        <div className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-black/70 text-primary backdrop-blur">
                          <Heart className="size-3.5" fill="currentColor" />
                        </div>
                      )}

                      {interaction.rating !== null && (
                        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-semibold text-rating">
                          <Star className="size-3 fill-current" />
                          {interaction.rating}
                        </div>
                      )}

                      {interaction.status && (
                        <div className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                          {interaction.status === 'watchlist' && 'Watchlist'}

                          {interaction.status === 'watching' && 'Watching'}

                          {interaction.status === 'watched' && 'Watched'}

                          {interaction.status === 'dropped' && 'Dropped'}
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex items-start gap-2">
                        <h2 className="line-clamp-1 flex-1 text-sm font-semibold transition-colors group-hover:text-primary">
                          {media.title}
                        </h2>

                        <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                          {media.type === 'movie' ? 'Movie' : 'TV'}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {media.releaseDate
                          ? new Date(media.releaseDate).getFullYear()
                          : '—'}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default ShelfPage;
