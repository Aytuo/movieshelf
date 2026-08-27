import { MediaCastMember } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';

type MovieCastProps = {
  cast: MediaCastMember[];
};

const MovieCast = ({ cast }: MovieCastProps) => {
  if (cast.length === 0) {
    return null;
  }

  return (
    <section className="container-content py-14 lg:py-20">
      <div className="mb-7">
        <p className="eyebrow">The people</p>

        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
          Cast
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {cast.slice(0, 12).map((person) => {
          const image = tmdbImage(person.profilePath, 'w342');

          return (
            <article key={person.id}>
              <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                {image ? (
                  <img
                    src={image}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                    {person.name}
                  </div>
                )}
              </div>

              <h3 className="mt-3 line-clamp-1 text-sm font-semibold">
                {person.name}
              </h3>

              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {person.character || 'Actor'}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default MovieCast;
