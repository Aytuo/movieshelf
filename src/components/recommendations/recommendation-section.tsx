import { tmdbImage } from '@/lib/tmdb/images';
import { MediaRecommendation } from '@/types';
import Link from 'next/link';

type RecommendationSectionProps = {
  recommendations: MediaRecommendation[];
  title?: string;
  description?: string;
};

const RecommendationSection = ({
  recommendations,
  title = 'Picked for you',
  description = 'Movies that fit your taste without boxing you into it.',
}: RecommendationSectionProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="container-content py-14 lg:py-20">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">For you</p>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {recommendations.map(({ media, reason }) => {
          const poster = tmdbImage(media.posterPath, 'w500');

          return (
            <Link
              key={media.tmdbId}
              href={`/movie/${media.tmdbId}`}
              className="group"
            >
              <article>
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                  {poster && (
                    <img
                      src={poster}
                      alt={`${media.title} poster`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <h3 className="mt-3 line-clamp-1 text-sm font-semibold transition-colors group-hover:text-primary">
                  {media.title}
                </h3>

                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {reason}
                </p>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecommendationSection;
