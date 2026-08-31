import ActivityTimeline from '@/components/activity/activity-timeline';
import { requireSession } from '@/lib/auth/require-session';
import { getUserActivity } from '@/lib/services/activity-service';

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
            A timeline of the movies and TV series you&apos;ve watched,
            reviewed, and added to your shelf.
          </p>
        </div>
      </section>

      <section className="container-content py-10 lg:py-14">
        <ActivityTimeline activities={activities} />
      </section>
    </main>
  );
};

export default ActivityPage;
