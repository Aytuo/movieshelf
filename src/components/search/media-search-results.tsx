import type { Media } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import Link from 'next/link';

type MediaSearchResultsProps = {
  media: Media[];
};

const MediaSearchResults = ({ media }: MediaSearchResultsProps) => {
  return (
    <>
      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {media.map((item) => {
          const poster = tmdbImage(item.posterPath, 'w500');

          const releaseYear = item.releaseDate
            ? new Date(item.releaseDate).getFullYear()
            : null;

          const href =
            item.type === 'movie'
              ? `/movie/${item.tmdbId}`
              : `/tv/${item.tmdbId}`;

          return (
            <Link
              key={`${item.type}:${item.tmdbId}`}
              href={href}
              className="group"
            >
              <article>
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                  {poster ? (
                    <img
                      src={poster}
                      alt={`${item.title} poster`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-sm text-muted-foreground">
                      No poster
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                  <span className="absolute top-3 left-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
                    {item.type === 'movie' ? 'Movie' : 'TV'}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {releaseYear ?? '—'}
                  </p>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default MediaSearchResults;
