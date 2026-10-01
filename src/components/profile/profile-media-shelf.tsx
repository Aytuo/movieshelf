import MediaCard from '@/components/media/media-card';
import type { Media } from '@/lib/media';
import type { LucideIcon } from 'lucide-react';
import EmptyState from '../ui/empty-state';

type ProfileMediaItem = {
  media: {
    tmdbId: number;
    type: 'movie' | 'tv';
    title: string;
    originalTitle: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string | null;
    tmdbRating: string | null;
    tmdbVoteCount: number;
    originalLanguage: string;
    genres: Media['genres'];
  };
};

type ProfileMediaShelfProps = {
  eyebrow: string;
  title: string;
  items: ProfileMediaItem[];
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: LucideIcon;
};

function toMedia(record: ProfileMediaItem['media']): Media {
  return {
    tmdbId: record.tmdbId,
    type: record.type,
    title: record.title,
    originalTitle: record.originalTitle,
    overview: record.overview,
    posterPath: record.posterPath,
    backdropPath: record.backdropPath,
    releaseDate: record.releaseDate,
    rating: Number(record.tmdbRating ?? 0),
    voteCount: record.tmdbVoteCount,
    originalLanguage: record.originalLanguage,
    genres: record.genres,
  };
}

export function ProfileMediaShelf({
  eyebrow,
  title,
  items,
  emptyTitle,
  emptyDescription,
  emptyIcon: EmptyIcon,
}: ProfileMediaShelfProps) {
  return (
    <section className="py-10 lg:py-14">
      <div className="mb-7">
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="mt-2 font-heading text-2xl font-bold">{title}</h2>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
          {items.map(({ media: record }) => {
            const media = toMedia(record);

            return (
              <MediaCard
                key={`${media.type}:${media.tmdbId}`}
                media={media}
                showGenres={false}
              />
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl p-12 surface">
          <EmptyState
            icon={EmptyIcon}
            title={emptyTitle}
            description={emptyDescription}
          />
        </div>
      )}
    </section>
  );
}
