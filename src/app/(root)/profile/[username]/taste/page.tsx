import TasteProfile from '@/components/profile/taste-profile';
import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { getTasteProfile } from '@/lib/services/taste-service';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

type TastePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const TastePage = async ({ params }: TastePageProps) => {
  const { username } = await params;

  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.username, username))
    .limit(1);

  const userProfile = result[0];

  if (!userProfile) {
    notFound();
  }

  const taste = await getTasteProfile(userProfile.userId);

  return (
    <main className="container-content py-12 lg:py-16">
      <div className="mb-10">
        <p className="eyebrow">@{userProfile.username}</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Your Taste
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          A visual snapshot of the movies, ratings and eras that shape your
          cinematic identity.
        </p>
      </div>

      <TasteProfile taste={taste} />
    </main>
  );
};

export default TastePage;
