import type { Media } from '@/lib/media';
import MediaCard from './media-card';

type MediaGridProps = {
  media: Media[];
};

const MediaGrid = ({ media }: MediaGridProps) => {
  if (media.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">No results found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {media.map((item) => (
        <MediaCard key={`${item.type}:${item.tmdbId}`} media={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
