import type { Media } from '@/lib/media';
import Link from 'next/link';
import MediaMeta from './media-meta';
import MediaPoster from './media-poster';

type MediaCardProps = {
  media: Media;
  showType?: boolean;
  showGenres?: boolean;
};

const MediaCard = ({
  media,
  showType = false,
  showGenres = true,
}: MediaCardProps) => {
  const href =
    media.type === 'movie' ? `/movie/${media.tmdbId}` : `/tv/${media.tmdbId}`;

  return (
    <Link href={href} className="group block">
      <article>
        <MediaPoster
          media={media}
          showTmdbRating
          showType={showType}
          className="aspect-[2/3]"
        />

        <div className="mt-3">
          <MediaMeta
            title={media.title}
            releaseDate={media.releaseDate}
            genres={media.genres}
            genreLimit={1}
            showGenres={showGenres}
          />
        </div>
      </article>
    </Link>
  );
};

export default MediaCard;
