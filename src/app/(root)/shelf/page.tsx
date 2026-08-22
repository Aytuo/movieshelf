import { requireSession } from '@/lib/auth/require-session';
import { getUserShelf } from '@/lib/repositories/user-movie-repository';
import { tmdbImage } from '@/lib/tmdb/images';
import { Bookmark, Heart, Star } from 'lucide-react';
import Link from 'next/link';

type ShelfPageProps = {
  searchParams: Promise<{
    filter?: 'all' | 'watchlist' | 'watched' | 'favorites';
  }>;
};

const ShelfPage = async ({ searchParams }: ShelfPageProps) => {
  const session = await requireSession();

  const { filter = 'all' } = await searchParams;

  const shelf = await getUserShelf(session.user.id);

  const filtered = shelf.filter(({ shelf }) => {
    if (filter === 'watchlist') {
      return shelf.status === 'watchlist';
    }

    if (filter === 'watched') {
      return shelf.status === 'watched';
    }

    if (filter === 'favorites') {
      return shelf.favorite;
    }

    return true;
  });

  const counts = {
    all: shelf.length,

    watchlist: shelf.filter(({ shelf }) => shelf.status === 'watchlist').length,

    watched: shelf.filter(({ shelf }) => shelf.status === 'watched').length,

    favorites: shelf.filter(({ shelf }) => shelf.favorite).length,
  };

  const filters = [
    {
      label: 'All',
      value: 'all',
      count: counts.all,
      icon: Bookmark,
    },
    {
      label: 'Watchlist',
      value: 'watchlist',
      count: counts.watchlist,
      icon: Bookmark,
    },
    {
      label: 'Watched',
      value: 'watched',
      count: counts.watched,
      icon: Star,
    },
    {
      label: 'Favorites',
      value: 'favorites',
      count: counts.favorites,
      icon: Heart,
    },
  ] as const;

  return (
    <section className="container-content py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Your collection</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          My Shelf
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Everything you&apos;ve decided deserves a place in your personal movie
          collection.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((item) => {
          const Icon = item.icon;

          const active = filter === item.value;

          return (
            <Link
              key={item.value}
              href={
                item.value === 'all' ? '/shelf' : `/shelf?filter=${item.value}`
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

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-24 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-surface">
            <Bookmark className="size-5 text-muted-foreground" />
          </div>

          <h2 className="mt-5 font-heading text-xl font-semibold">
            {filter === 'all'
              ? 'Your shelf is empty'
              : `No ${filter} movies yet`}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Discover movies and give the ones that matter a place on your shelf.
          </p>

          <Link
            href="/discover"
            className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Discover movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map(({ movie, shelf }) => {
            const poster = tmdbImage(movie.posterPath, 'w500');

            return (
              <Link
                key={movie.id}
                href={`/movie/${movie.tmdbId}`}
                className="group"
              >
                <article>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                    {poster && (
                      <img
                        src={poster}
                        alt={`${movie.title} poster`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    {shelf.favorite && (
                      <div className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-black/70 text-primary backdrop-blur">
                        <Heart className="size-3.5" fill="currentColor" />
                      </div>
                    )}

                    {shelf.rating && (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-xs font-semibold text-rating">
                        <Star className="size-3 fill-current" />
                        {shelf.rating}
                      </div>
                    )}
                  </div>

                  <h2 className="mt-3 line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                    {movie.title}
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {movie.releaseDate
                      ? new Date(movie.releaseDate).getFullYear()
                      : '—'}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ShelfPage;
