import { MOCK_MOVIES } from '@/constants';
import { notFound } from 'next/navigation';

type MovieDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const MovieDetailsPage = async ({ params }: MovieDetailsPageProps) => {
  const { id } = await params;

  const movie = MOCK_MOVIES.find((movie) => movie.id === Number(id));

  if (!movie) {
    notFound();
  }

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/60">
        {movie.backdropPath && (
          <div className="absolute inset-0">
            <img
              src={movie.backdropPath}
              alt=""
              className="h-full w-full object-cover opacity-20"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          </div>
        )}

        <div className="relative container-content py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
            <div className="mx-auto w-full max-w-[280px]">
              <div className="overflow-hidden rounded-xl border border-border shadow-2xl">
                <img
                  src={movie.posterPath ?? ''}
                  alt={`${movie.title} poster`}
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{new Date(movie.releaseDate).getFullYear()}</span>

                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                  </>
                )}
              </div>

              <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-3 text-base text-muted-foreground italic">
                  {movie.tagline}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {movie.overview}
              </p>

              <div className="mt-7 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-sm font-semibold">
                  <span className="text-rating">★</span>
                  {movie.rating.toFixed(1)}
                </span>

                <span className="text-xs text-muted-foreground">
                  {movie.voteCount.toLocaleString()} ratings
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MovieDetailsPage;
