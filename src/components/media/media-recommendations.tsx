import type { Media } from '@/lib/media';
import MediaCard from './media-card';

type MediaRecommendationsProps = {
  media: Media[];
  title?: string;
  eyebrow?: string;
};

const MediaRecommendations = ({
  media,
  title = 'You might also like',
  eyebrow = 'Keep exploring',
}: MediaRecommendationsProps) => {
  if (media.length === 0) {
    return null;
  }

  return (
    <section className="container-content py-14 lg:py-20">
      <div className="mb-7">
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {media.slice(0, 6).map((item) => (
          <MediaCard key={`${item.type}:${item.tmdbId}`} media={item} />
        ))}
      </div>
    </section>
  );
};

export default MediaRecommendations;
