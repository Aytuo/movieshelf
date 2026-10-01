import MediaMeta from '@/components/media/media-meta';
import MediaPoster from '@/components/media/media-poster';
import EmptyState from '@/components/ui/empty-state';
import { requireSession } from '@/lib/auth/require-session';
import { getUserShelf } from '@/lib/services/media-interaction-service';
import {
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Heart,
  Library,
  X,
} from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

type ShelfFilter =
  'all' | 'watchlist' | 'watching' | 'watched' | 'dropped' | 'favorites';

type ShelfMediaType = 'all' | 'movie' | 'tv';

type ShelfPageProps = {
  searchParams: Promise<{
    filter?: ShelfFilter;
    type?: ShelfMediaType;
  }>;
};

export const metadata: Metadata = {
  title: 'Your Shelf',
  description:
    'Manage your movie and TV collection, watchlist and watched titles.',
};

const ShelfPage = async ({ searchParams }: ShelfPageProps) => {
  const session = await requireSession();

  const { filter = 'all', type = 'all' } = await searchParams;

  const shelf = await getUserShelf(session.user.id);

  const filtered = shelf.filter(({ media, interaction }) => {
    const matchesType = type === 'all' || media.type === type;

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'watchlist'
          ? interaction.status === 'watchlist'
          : filter === 'watching'
            ? interaction.status === 'watching'
            : filter === 'watched'
              ? interaction.status === 'watched'
              : filter === 'dropped'
                ? interaction.status === 'dropped'
                : interaction.favorite;

    return matchesType && matchesFilter;
  });

  const mediaTypeScopedShelf = shelf.filter(
    ({ media }) => type === 'all' || media.type === type
  );

  const filterScopedShelf = shelf.filter(({ interaction }) => {
    if (filter === 'all') {
      return true;
    }

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

    return interaction.favorite;
  });

  const statusCounts = {
    all: mediaTypeScopedShelf.length,
    watchlist: mediaTypeScopedShelf.filter(
      ({ interaction }) => interaction.status === 'watchlist'
    ).length,
    watching: mediaTypeScopedShelf.filter(
      ({ interaction }) => interaction.status === 'watching'
    ).length,
    watched: mediaTypeScopedShelf.filter(
      ({ interaction }) => interaction.status === 'watched'
    ).length,
    dropped: mediaTypeScopedShelf.filter(
      ({ interaction }) => interaction.status === 'dropped'
    ).length,
    favorites: mediaTypeScopedShelf.filter(
      ({ interaction }) => interaction.favorite
    ).length,
  };

  const typeCounts = {
    all: filterScopedShelf.length,
    movie: filterScopedShelf.filter(({ media }) => media.type === 'movie')
      .length,
    tv: filterScopedShelf.filter(({ media }) => media.type === 'tv').length,
  };

  const statusFilters = [
    {
      label: 'All',
      value: 'all' as const,
      icon: Library,
    },
    {
      label: 'Watchlist',
      value: 'watchlist' as const,
      icon: Bookmark,
    },
    {
      label: 'Watching',
      value: 'watching' as const,
      icon: Clock3,
    },
    {
      label: 'Watched',
      value: 'watched' as const,
      icon: Check,
    },
    {
      label: 'Dropped',
      value: 'dropped' as const,
      icon: X,
    },
    {
      label: 'Favorites',
      value: 'favorites' as const,
      icon: Heart,
    },
  ];

  const emptyTitle =
    type === 'movie'
      ? filter === 'all'
        ? 'You have no movies on your shelf'
        : filter === 'watchlist'
          ? 'Your movie watchlist is empty'
          : filter === 'watching'
            ? 'You are not watching any movies'
            : filter === 'watched'
              ? 'You have no watched movies yet'
              : filter === 'dropped'
                ? 'You have no dropped movies'
                : 'You have no favorite movies yet'
      : type === 'tv'
        ? filter === 'all'
          ? 'You have no TV series on your shelf'
          : filter === 'watchlist'
            ? 'Your TV watchlist is empty'
            : filter === 'watching'
              ? 'You are not watching any TV series'
              : filter === 'watched'
                ? 'You have no watched TV series yet'
                : filter === 'dropped'
                  ? 'You have no dropped TV series'
                  : 'You have no favorite TV series yet'
        : filter === 'all'
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

  const emptyIcon =
    statusFilters.find((item) => item.value === filter)?.icon ?? Bookmark;

  function buildShelfHref(
    nextFilter: ShelfFilter = filter,
    nextType: ShelfMediaType = type
  ) {
    const params = new URLSearchParams();

    if (nextFilter !== 'all') {
      params.set('filter', nextFilter);
    }

    if (nextType !== 'all') {
      params.set('type', nextType);
    }

    const query = params.toString();

    return query ? `/shelf?${query}` : '/shelf';
  }

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
        <div className="mb-10 space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Media
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: 'All',
                  value: 'all' as const,
                  count: typeCounts.all,
                },
                {
                  label: 'Movies',
                  value: 'movie' as const,
                  count: typeCounts.movie,
                },
                {
                  label: 'TV Series',
                  value: 'tv' as const,
                  count: typeCounts.tv,
                },
              ].map((item) => {
                const active = type === item.value;

                return (
                  <Link
                    key={item.value}
                    href={buildShelfHref(filter, item.value)}
                    className={[
                      'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary/30 bg-primary-muted text-primary'
                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground',
                    ].join(' ')}
                  >
                    {item.label}

                    <span className="text-xs opacity-60">{item.count}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Status
            </p>

            <div className="flex flex-wrap gap-2">
              {statusFilters.map((item) => {
                const Icon = item.icon;
                const active = filter === item.value;

                return (
                  <Link
                    key={item.value}
                    href={buildShelfHref(item.value, type)}
                    className={[
                      'inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'border-primary/30 bg-primary-muted text-primary'
                        : 'border-border bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground',
                    ].join(' ')}
                  >
                    <Icon className="size-3.5" />

                    {item.label}

                    <span className="text-xs opacity-60">
                      {statusCounts[item.value]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl p-12 surface">
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              action={
                <Link
                  href="/discover"
                  className="inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Discover
                </Link>
              }
            />
          </div>
        ) : (
          /* Media grid */
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map(({ media, interaction }) => (
              <Link
                key={`${media.type}:${media.tmdbId}`}
                href={
                  media.type === 'movie'
                    ? `/movie/${media.tmdbId}`
                    : `/tv/${media.tmdbId}`
                }
                className="group"
              >
                <article>
                  <MediaPoster
                    media={{
                      posterPath: media.posterPath,
                      title: media.title,
                      type: media.type,
                    }}
                    showType
                    favorite={interaction.favorite}
                    status={interaction.status}
                    userRating={interaction.rating}
                    className="aspect-[2/3]"
                  />

                  <div className="mt-3">
                    <MediaMeta
                      title={media.title}
                      releaseDate={media.releaseDate}
                      genres={media.genres}
                      showGenres={false}
                    />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default ShelfPage;
