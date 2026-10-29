'use client';

import {
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  Clapperboard,
  Clock3,
  Film,
  Heart,
  Library,
  Menu,
  Search,
  Star,
  Tv,
  UserRound,
  X,
} from 'lucide-react';
import Image from 'next/image';

const titles = [
  {
    title: 'Interstellar',
    rating: '10',
    tmdbRating: '8.7',
    year: '2014',
    type: 'Movie',
    favorite: true,
    image: 'https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    title: 'Stranger Things',
    rating: '9',
    tmdbRating: '8.6',
    year: '2016',
    type: 'TV Series',
    favorite: false,
    image: 'https://image.tmdb.org/t/p/w342/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
  },
  {
    title: 'Dune: Part Two',
    rating: '9',
    tmdbRating: '8.2',
    year: '2024',
    type: 'Movie',
    favorite: false,
    image: 'https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    title: 'Breaking Bad',
    rating: '10',
    tmdbRating: '8.9',
    year: '2008',
    type: 'TV Series',
    favorite: true,
    image: 'https://image.tmdb.org/t/p/w342/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  },
  {
    title: 'The Godfather',
    rating: '10',
    tmdbRating: '8.7',
    year: '1972',
    type: 'Movie',
    favorite: false,
    image: 'https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  },
];

const ShelfPreview = () => {
  return (
    <section id="shelf" className="overflow-hidden border-b border-border/60">
      <div className="container-content py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_30px_100px_rgb(0_0_0/35%)]">
            {/* App navbar */}
            <div className="relative grid h-12 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-border/60 px-3 sm:px-4 md:flex md:justify-between">
              {/* Left: mobile menu and desktop brand */}
              <div className="flex min-w-0 items-center">
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground md:hidden"
                >
                  <Menu className="size-3.5" />
                </span>

                <div className="hidden shrink-0 items-center gap-1.5 md:flex">
                  <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <Clapperboard className="size-3.5" />
                  </span>

                  <span className="text-xs font-bold tracking-tight">
                    Movie<span className="text-primary">Shelf</span>
                  </span>
                </div>
              </div>

              {/* Center: mobile brand / desktop navigation */}
              <div className="flex items-center justify-self-center md:hidden">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Clapperboard className="size-3.5" />
                </span>

                <span className="ml-1.5 text-xs font-bold tracking-tight">
                  Movie<span className="text-primary">Shelf</span>
                </span>
              </div>

              <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-3 text-[10px] font-medium text-muted-foreground md:flex lg:gap-4">
                <span>Movies</span>
                <span>TV Series</span>
                <span>Discover</span>
                <span>Rankings</span>
              </nav>

              {/* Right: search, notifications and profile */}
              <div className="flex shrink-0 items-center gap-1.5 justify-self-end md:flex-1 md:justify-end">
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground"
                >
                  <Search className="size-3.5" />
                </span>

                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground"
                >
                  <Bell className="size-3.5" />
                </span>

                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-muted-foreground"
                >
                  <UserRound className="size-3.5" />
                </span>

                <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
              </div>
            </div>

            {/* Shelf page */}
            <div className="p-4 sm:p-5">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-medium tracking-[0.16em] text-primary uppercase">
                    Your collection
                  </p>

                  <h3 className="mt-1 font-heading text-xl font-semibold">
                    My Shelf
                  </h3>

                  <p className="mt-1 hidden max-w-md text-xs leading-5 text-muted-foreground sm:block">
                    Everything you&apos;ve decided deserves a place in your
                    personal collection.
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  Activity
                  <ArrowRight className="size-3" />
                </span>
              </div>

              {/* Media filters */}
              <div className="mt-5">
                <p className="mb-2 text-[10px] font-medium text-muted-foreground">
                  Media
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary-muted px-2 py-1.5 text-[10px] font-medium text-primary">
                    All <span className="opacity-60">42</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    Movies <span className="opacity-60">28</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    TV Series <span className="opacity-60">14</span>
                  </span>
                </div>
              </div>

              {/* Status filters */}
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-medium text-muted-foreground">
                  Status
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary-muted px-2 py-1.5 text-[10px] font-medium text-primary">
                    <Library className="size-3" />
                    All <span className="opacity-60">42</span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Bookmark className="size-3" />
                    Watchlist
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Clock3 className="size-3" />
                    Watching
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Check className="size-3" />
                    Watched
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <X className="size-3" />
                    Dropped
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <Heart className="size-3" />
                    Favorites
                  </span>
                </div>
              </div>

              {/* Media grid */}
              <div className="mt-6 grid grid-cols-3 gap-x-2.5 gap-y-4 sm:grid-cols-5">
                {titles.map((title) => (
                  <div key={title.title} className="group min-w-0">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface">
                      <Image
                        src={title.image}
                        alt={`${title.title} poster`}
                        fill
                        sizes="(max-width: 640px) 30vw, 120px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />

                      {/* Movie or TV badge */}
                      <div
                        className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded bg-black/80 text-white shadow-sm"
                        title={title.type === 'Movie' ? 'Film' : 'TV'}
                      >
                        {title.type === 'Movie' ? (
                          <Film className="size-3" />
                        ) : (
                          <Tv className="size-3" />
                        )}
                      </div>

                      {/* TMDB rating */}
                      <div className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded bg-black/80 px-1 py-1 text-[8px] font-semibold text-white shadow-sm">
                        <Star className="size-2.5 fill-current text-rating" />
                        {title.tmdbRating}
                      </div>

                      {/* User rating and favorite */}
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 rounded bg-black/75 px-1.5 py-1 text-[9px] font-semibold text-rating">
                          <Star className="size-2.5 fill-current" />
                          {title.rating}
                        </span>

                        {title.favorite && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-black/75 text-rose-400">
                            <Heart className="size-3 fill-current" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MediaMeta */}
                    <div className="mt-2 min-w-0">
                      <p className="truncate text-[10px] font-semibold transition-colors group-hover:text-primary">
                        {title.title}
                      </p>

                      <p className="mt-1 text-[9px] text-muted-foreground">
                        {title.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow">Your shelf</p>

            <h2 className="mt-5 font-heading text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Build a collection that feels like you.
            </h2>

            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Your shelf isn&apos;t another watch queue. It&apos;s a record of
              the movies and TV shows you&apos;ve discovered, loved, rated and
              decided to keep.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 surface">
                <Bookmark className="size-4 text-primary" />
                <div className="mt-4 text-2xl font-bold">42</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  titles collected
                </p>
              </div>

              <div className="rounded-xl p-4 surface">
                <Heart className="size-4 text-primary" />
                <div className="mt-4 text-2xl font-bold">8</div>
                <p className="mt-1 text-xs text-muted-foreground">favorites</p>
              </div>

              <div className="rounded-xl p-4 surface">
                <Star className="size-4 text-rating" />
                <div className="mt-4 text-2xl font-bold">17</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  titles rated
                </p>
              </div>

              <div className="rounded-xl p-4 surface">
                <Star className="size-4 fill-current text-rating" />

                <div className="mt-4 text-2xl font-bold">8.1</div>

                <p className="mt-1 text-xs text-muted-foreground">
                  average rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShelfPreview;
