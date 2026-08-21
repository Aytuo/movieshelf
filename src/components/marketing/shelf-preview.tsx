'use client';

import { Bookmark, Heart, Search, Star } from 'lucide-react';

const movies = [
  {
    title: 'Interstellar',
    rating: '10',
    image: 'https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    title: 'The Dark Knight',
    rating: '9',
    image: 'https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  {
    title: 'Dune: Part Two',
    rating: '9',
    image: 'https://image.tmdb.org/t/p/w342/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
  },
  {
    title: 'Inception',
    rating: '9',
    image: 'https://image.tmdb.org/t/p/w342/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  },
  {
    title: 'The Godfather',
    rating: '10',
    image: 'https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
  },
];

const ShelfPreview = () => {
  return (
    <section id="shelf" className="overflow-hidden border-b border-border/60">
      <div className="container-content py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-2xl border border-border bg-[#090a0d] shadow-[0_30px_100px_rgb(0_0_0_/_35%)]">
            {/* Fake application chrome */}
            <div className="flex h-12 items-center justify-between border-b border-border/70 px-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold tracking-wide">
                  MOVIESHELF
                </span>
              </div>

              <Search className="size-3.5 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-[115px_1fr]">
              <aside className="hidden border-r border-border/70 p-4 sm:block">
                <div className="space-y-3 text-[10px] text-muted-foreground">
                  <div className="text-foreground">Home</div>
                  <div>Discover</div>
                  <div className="text-primary">My Shelf</div>
                  <div>Favorites</div>
                  <div>Ratings</div>
                  <div>Watchlist</div>
                </div>
              </aside>

              <div className="p-5 sm:p-7">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.18em] text-primary uppercase">
                      Your collection
                    </p>

                    <h3 className="mt-2 font-heading text-xl font-semibold">
                      Your Shelf
                    </h3>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    42 films
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {movies.map((movie) => (
                    <div key={movie.title}>
                      <div className="aspect-[2/3] overflow-hidden rounded-lg">
                        <img
                          src={movie.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-1">
                        <span className="truncate text-[10px] font-medium">
                          {movie.title}
                        </span>

                        <span className="shrink-0 text-[9px] text-rating">
                          ★ {movie.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
              the movies you&apos;ve discovered, loved, rated and decided to
              keep.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 surface">
                <Bookmark className="size-4 text-primary" />
                <div className="mt-4 text-2xl font-bold">42</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  films collected
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
                  films rated
                </p>
              </div>

              <div className="rounded-xl p-4 surface">
                <span className="text-lg text-primary">8.1</span>
                <div className="mt-3 text-xs text-muted-foreground">
                  average rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShelfPreview;
