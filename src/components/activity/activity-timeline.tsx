import type { MediaActivityItem } from '@/lib/services/media-activity-service';
import { tmdbImage } from '@/lib/tmdb/images';
import {
  Activity,
  Bookmark,
  Check,
  Clock3,
  Heart,
  MessageSquare,
  Star,
  X,
} from 'lucide-react';
import Link from 'next/link';

type MediaActivityTimelineProps = {
  activities: MediaActivityItem[];
};

const ActivityTimeline = ({ activities }: MediaActivityTimelineProps) => {
  if (activities.length === 0) {
    return (
      <div className="mt-10 rounded-2xl p-12 text-center surface">
        <Activity className="mx-auto size-6 text-muted-foreground" />

        <h2 className="mt-4 font-heading text-xl font-semibold">
          Your activity is empty
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Your cinematic journey will appear here as you watch, rate, review,
          and add movies and TV series to your shelf.
        </p>

        <Link
          href="/discover"
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Discover
        </Link>
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
              {/* Activity icon */}
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                {activity.type === 'watched' && (
                  <Check className="size-4 text-primary" />
                )}

                {activity.type === 'reviewed' && (
                  <MessageSquare className="size-4 text-primary" />
                )}

                {activity.type === 'watchlist_added' && (
                  <Bookmark className="size-4 text-primary" />
                )}

                {activity.type === 'watching_started' && (
                  <Clock3 className="size-4 text-primary" />
                )}

                {activity.type === 'dropped' && (
                  <X className="size-4 text-muted-foreground" />
                )}

                {activity.type === 'favorite_added' && (
                  <Heart className="size-4 text-primary" fill="currentColor" />
                )}

                {activity.type === 'favorite_removed' && (
                  <Heart className="size-4 text-muted-foreground" />
                )}

                {activity.type === 'rated' && (
                  <Star className="size-4 fill-current text-rating" />
                )}

                {activity.type === 'shelf_removed' && (
                  <X className="size-4 text-muted-foreground" />
                )}
              </div>

              {/* Activity card */}
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
                  {/* Date + media type */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(activity.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>

                    <span>•</span>

                    <span className="font-semibold tracking-wide uppercase">
                      {media.type === 'movie' ? 'Movie' : 'TV Series'}
                    </span>
                  </div>

                  {/* Activity description */}
                  <h2 className="mt-2 font-heading font-semibold">
                    {activity.type === 'watched' &&
                      (activity.watchNumber === 1
                        ? 'You watched'
                        : 'You rewatched')}

                    {activity.type === 'reviewed' && 'You reviewed'}

                    {activity.type === 'watchlist_added' &&
                      'You added to your watchlist'}

                    {activity.type === 'watching_started' &&
                      'You started watching'}

                    {activity.type === 'dropped' && 'You dropped'}

                    {activity.type === 'favorite_added' &&
                      'You added to your favorites'}

                    {activity.type === 'favorite_removed' &&
                      'You removed this from your favorites'}

                    {activity.type === 'rated' &&
                      `You rated this ${activity.rating}/10`}

                    {activity.type === 'shelf_removed' &&
                      'You removed this from your shelf'}
                  </h2>

                  {activity.type === 'watched' && activity.watchNumber > 1 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Rewatch #{activity.watchNumber - 1}
                    </p>
                  )}

                  {/* Media title */}
                  <Link
                    href={href}
                    className="mt-1 block text-sm font-medium hover:text-primary"
                  >
                    {media.title}
                  </Link>

                  {/* Review content */}
                  {activity.type === 'reviewed' && activity.review.content && (
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
