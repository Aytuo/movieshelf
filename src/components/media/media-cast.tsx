import type { MediaCastMember } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import Link from 'next/link';

type MediaCastProps = {
  cast: MediaCastMember[];
};

const MediaCast = ({ cast }: MediaCastProps) => {
  if (cast.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/60">
      <div className="container-content py-14 lg:py-20">
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
              <Link
                key={person.id}
                href={`/person/${person.id}`}
                className="group"
              >
                <article>
                  <div className="aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                    {image ? (
                      <img
                        src={image}
                        alt={person.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                        {person.name}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-3 line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                    {person.name}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {person.character || 'Actor'}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MediaCast;
