import type { Media } from '@/lib/media';
import type { SearchMediaType } from '@/types';
import Link from 'next/link';
import MediaMeta from '../media/media-meta';
import MediaPoster from '../media/media-poster';

type MediaSearchResultsProps = {
  media: Media[];
  type: SearchMediaType;
};

const MediaSearchResults = ({ media, type }: MediaSearchResultsProps) => {
  return (
    <>
      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {media.map((item) => {
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
                <MediaPoster
                  media={item}
                  showTmdbRating
                  showType={type === 'all'}
                  className="aspect-[2/3]"
                />

                <div className="mt-3">
                  <MediaMeta
                    title={item.title}
                    releaseDate={item.releaseDate}
                    genres={item.genres}
                    genreLimit={1}
                  />
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
