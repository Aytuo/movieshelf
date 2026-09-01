import ActivityTimeline from '@/components/activity/activity-timeline';
import ProfileNavbar from '@/components/profile/profile-navbar';
import { getPublicActivity } from '@/lib/services/profile-service';
import { Activity } from 'lucide-react';
import { notFound } from 'next/navigation';

type ProfileActivityPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfileActivityPage = async ({ params }: ProfileActivityPageProps) => {
  const { username } = await params;

  const data = await getPublicActivity(username);

  if (!data) {
    notFound();
  }

  const { profile, activities } = data;

  return (
    <main className="container-content py-12 lg:py-16">
      <header>
        <p className="eyebrow">@{profile.username}</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Activity
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          A timeline of this user&apos;s watched, rated, reviewed, and shelf
          activity.
        </p>

        <div className="mt-7">
          <ProfileNavbar username={profile.username} />
        </div>
      </header>

      <section className="py-10 lg:py-14">
        {activities.length > 0 ? (
          <ActivityTimeline activities={activities} />
        ) : (
          <div className="rounded-2xl p-12 text-center surface">
            <Activity className="mx-auto size-6 text-muted-foreground" />

            <h2 className="mt-4 font-heading text-xl font-semibold">
              No activity yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              This cinematic journey will appear here as they use MovieShelf.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfileActivityPage;
