import type { ActivityItem } from '@/lib/services/activity-service';
import { tmdbImage } from '@/lib/tmdb/images';
import { Check, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

type ActivityTimelineProps = {
  activities: ActivityItem[];
};

const ActivityTimeline = ({ activities }: ActivityTimelineProps) => {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center surface">
        <h2 className="font-heading text-xl font-semibold">Nothing here yet</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Your cinematic story will appear here as you use MovieShelf.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-5 hidden h-full w-px bg-border md:block" />

      <div className="space-y-6">
        {activities.map((activity) => {
          const media = activity.media;

          const poster = tmdbImage(media.posterPath, 'w500');

          const href =
            media.type === 'movie'
              ? `/movie/${media.tmdbId}`
              : `/tv/${media.tmdbId}`;

          return (
            <article
              key={`${activity.type}-${activity.id}`}
              className="relative flex gap-5 md:gap-8"
            >
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                {activity.type === 'watched' && (
                  <Check className="size-4 text-primary" />
                )}

                {activity.type === 'review' && (
                  <MessageSquare className="size-4 text-primary" />
                )}

                {activity.type === 'shelf' && (
                  <Plus className="size-4 text-primary" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 gap-4 rounded-2xl p-4 surface">
                <Link
                  href={href}
                  className="w-20 shrink-0 overflow-hidden rounded-lg"
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={`${media.title} poster`}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] w-full items-center justify-center bg-surface-hover px-2 text-center text-[10px] text-muted-foreground">
                      No poster
                    </div>
                  )}
                </Link>

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>

                  <h2 className="mt-1 font-heading font-semibold">
                    {activity.type === 'watched' && 'You watched'}

                    {activity.type === 'review' && 'You reviewed'}

                    {activity.type === 'shelf' && 'You updated your shelf'}
                  </h2>

                  <Link
                    href={href}
                    className="mt-1 block text-sm font-medium hover:text-primary"
                  >
                    {media.title}
                  </Link>

                  <div className="mt-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {media.type === 'movie' ? 'Movie' : 'TV Series'}
                  </div>

                  {activity.type === 'review' && activity.review.content && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {activity.review.content}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
