import ProfileNavbar from '@/components/profile/profile-navbar';
import TasteOverview from '@/components/taste/taste-overview';
import { getPublicTaste } from '@/lib/services/profile-service';
import { notFound } from 'next/navigation';

type ProfileTastePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfileTastePage = async ({ params }: ProfileTastePageProps) => {
  const { username } = await params;

  const data = await getPublicTaste(username);

  if (!data) {
    notFound();
  }

  const { profile, taste } = data;

  return (
    <main className="container-content py-12 lg:py-16">
      <header>
        <p className="eyebrow">@{profile.username}</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Taste
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          A visual snapshot of the movies, ratings, and eras that define this
          taste profile.
        </p>

        <div className="mt-7">
          <ProfileNavbar username={profile.username} />
        </div>
      </header>

      <section className="py-10 lg:py-14">
        <TasteOverview taste={taste} />
      </section>
    </main>
  );
};

export default ProfileTastePage;
