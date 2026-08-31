import ActivityTimeline from '@/components/activity/activity-timeline';
import { requireSession } from '@/lib/auth/require-session';
import { getUserMediaActivity } from '@/lib/services/media-activity-service';
import { Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ActivityPage = async () => {
  const session = await requireSession();
  const activities = await getUserMediaActivity(session.user.id);

  return (
    <main className="container-content py-12 lg:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your journey</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Activity
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            A timeline of the things you&apos;ve watched, reviewed, rated, and
            added to your shelf.
          </p>
        </div>

        <Link
          href="/history"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Watch history
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <section className="py-10 lg:py-14">
        {activities.length === 0 ? (
          <div className="mt-0 rounded-2xl p-12 text-center surface">
            <Activity className="mx-auto size-6 text-muted-foreground" />

            <h2 className="mt-4 font-heading text-xl font-semibold">
              Your activity is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Your cinematic journey will appear here as you watch, rate,
              review, and add movies and TV series to your shelf.
            </p>

            <Link
              href="/discover"
              className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Discover
            </Link>
          </div>
        ) : (
          <ActivityTimeline activities={activities} />
        )}
      </section>
    </main>
  );
};

export default ActivityPage;
