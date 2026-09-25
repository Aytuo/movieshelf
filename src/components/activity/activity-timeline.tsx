import type { MediaActivityItem } from '@/lib/services/media-activity-service';
import { tmdbImage } from '@/lib/tmdb/images';
import {
  Activity,
  Bookmark,
  Check,
  Clock3,
  Film,
  Heart,
  MessageSquare,
  Star,
  Tv,
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
                <div className="relative aspect-[2/3] w-20 shrink-0 self-start overflow-hidden rounded-lg">
                  <Link href={href} className="block">
                    {poster ? (
                      <img
                        src={poster}
                        alt={`${media.title} poster`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-hover px-2 text-center text-[10px] text-muted-foreground">
                        No poster
                      </div>
                    )}
                  </Link>

                  <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/70 px-1.5 py-1 text-[9px] font-medium text-white backdrop-blur-sm">
                    {media.type === 'movie' ? (
                      <Film className="size-3" aria-hidden="true" />
                    ) : (
                      <Tv className="size-3" aria-hidden="true" />
                    )}
                    {media.type === 'movie' ? 'Movie' : 'TV'}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  {/* Activity + timestamp */}
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading font-semibold">
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

                    <time
                      dateTime={new Date(activity.createdAt).toISOString()}
                      className="shrink-0 text-right text-xs text-muted-foreground"
                    >
                      {new Date(activity.createdAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </time>
                  </div>

                  {/* Media */}
                  <Link
                    href={href}
                    className="mt-2 inline-flex min-w-0 items-center transition-colors hover:text-primary"
                  >
                    <span className="truncate text-sm font-medium">
                      {media.title}
                      {media.releaseDate && (
                        <span className="text-muted-foreground">
                          {' '}
                          ({media.releaseDate.slice(0, 4)})
                        </span>
                      )}
                    </span>
                  </Link>

                  {/* Rewatch context */}
                  {activity.type === 'watched' && activity.watchNumber > 1 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Rewatch #{activity.watchNumber - 1}
                    </p>
                  )}

                  {/* Review context */}
                  {activity.type === 'reviewed' && activity.review?.content && (
                    <>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {activity.review.content}
                      </p>

                      <div className="mt-2 flex justify-end">
                        <Link
                          href={`${href}#reviews`}
                          className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                          Read full review →
                        </Link>
                      </div>
                    </>
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
