import { requireSession } from '@/lib/auth/require-session';
import { getUserActivity } from '@/lib/services/activity-service';
import { tmdbImage } from '@/lib/tmdb/images';
import { Check, MessageSquare, Plus } from 'lucide-react';
import Link from 'next/link';

const ActivityPage = async () => {
  const session = await requireSession();
  const activities = await getUserActivity(session.user.id);

  return (
    <main>
      <section className="border-b border-border/60">
        <div className="container-content py-12 lg:py-16">
          <p className="eyebrow">Your journey</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Activity
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            A timeline of the movies you&apos;ve watched, reviewed, and added to
            your shelf.
          </p>
        </div>
      </section>

      <section className="container-content py-10 lg:py-14">
        {activities.length === 0 ? (
          <div className="rounded-2xl p-10 text-center surface">
            <h2 className="font-heading text-xl font-semibold">
              Nothing here yet
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Your cinematic story will appear here as you use MovieShelf.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-0 left-5 hidden h-full w-px bg-border md:block" />

            <div className="space-y-6">
              {activities.map((activity) => {
                const poster = tmdbImage(activity.movie.posterPath, 'w500');

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
                        href={`/movie/${activity.movie.tmdbId}`}
                        className="w-20 shrink-0 overflow-hidden rounded-lg"
                      >
                        {poster && (
                          <img
                            src={poster}
                            alt={`${activity.movie.title} poster`}
                            className="aspect-[2/3] w-full object-cover"
                          />
                        )}
                      </Link>

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>

                        <h2 className="mt-1 font-heading font-semibold">
                          {activity.type === 'watched' && 'You watched'}

                          {activity.type === 'review' && 'You reviewed'}

                          {activity.type === 'shelf' &&
                            'You updated your shelf'}
                        </h2>

                        <Link
                          href={`/movie/${activity.movie.tmdbId}`}
                          className="mt-1 block text-sm font-medium hover:text-primary"
                        >
                          {activity.movie.title}
                        </Link>

                        {activity.type === 'review' &&
                          activity.review.content && (
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
        )}
      </section>
    </main>
  );
};

export default ActivityPage;
