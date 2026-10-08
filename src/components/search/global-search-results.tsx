import { tmdbImage } from '@/lib/tmdb/images';
import type { SearchAllItem } from '@/types';
import { ArrowRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MediaPoster from '../media/media-poster';

const GlobalSearchResults = ({
  results,
  onResultClick,
}: {
  results: SearchAllItem[];
  onResultClick: () => void;
}) => {
  return (
    <div className="py-2">
      {results.map((item) => {
        if (item.type === 'person') {
          const portrait = tmdbImage(item.person.profilePath, 'w185');

          return (
            <Link
              key={`person:${item.person.id}`}
              href={`/person/${item.person.id}`}
              onClick={onResultClick}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
            >
              <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface">
                {portrait ? (
                  <Image
                    src={portrait}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {item.person.name}
                </p>

                {item.person.knownForDepartment && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.person.knownForDepartment}
                  </p>
                )}
              </div>

              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        }

        const media = item.media;

        const href =
          media.type === 'movie'
            ? `/movie/${media.tmdbId}`
            : `/tv/${media.tmdbId}`;

        const year = media.releaseDate
          ? new Date(media.releaseDate).getFullYear()
          : null;

        return (
          <Link
            key={`${media.type}:${media.tmdbId}`}
            href={href}
            onClick={onResultClick}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover"
          >
            <MediaPoster
              media={media}
              compact
              showType
              className="h-72px w-12 shrink-0 rounded-lg"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {media.title}
                {year !== null && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    ({year})
                  </span>
                )}
              </p>

              {media.rating > 0 && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                  <Star className="size-3 fill-current text-rating" />
                  {media.rating.toFixed(1)}
                </p>
              )}

              {media.genres.length > 0 && (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {media.genres
                    .slice(0, 2)
                    .map((genre) => genre.name)
                    .join(' · ')}
                </p>
              )}
            </div>

            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </Link>
        );
      })}
    </div>
  );
};

export default GlobalSearchResults;
