import { requireSession } from '@/lib/auth/require-session';
import { getUserShelf } from '@/lib/repositories/user-movie-repository';
import { tmdbImage } from '@/lib/tmdb/images';

const ShelfPage = async () => {
  const session = await requireSession();
  const shelf = await getUserShelf(session.user.id);

  return (
    <section className="container-content py-12 lg:py-16">
      <div className="mb-10">
        <p className="text-sm font-medium text-primary">Your collection</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
          My Shelf
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Movies you&apos;ve decided deserve a place in your collection.
        </p>
      </div>

      {shelf.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center">
          <h2 className="font-heading text-xl font-semibold">
            Your shelf is empty
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Discover movies and add the ones you want to remember, watch or rate
            later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shelf.map(({ movie }) => (
            <article key={movie.id}>
              <div className="aspect-[2/3] overflow-hidden rounded-xl">
                {movie.posterPath && (
                  <img
                    src={tmdbImage(movie.posterPath, 'w500')}
                    alt={`${movie.title} poster`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <h2 className="mt-3 line-clamp-1 text-sm font-semibold">
                {movie.title}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {movie.releaseDate
                  ? new Date(movie.releaseDate).getFullYear()
                  : '—'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ShelfPage;
