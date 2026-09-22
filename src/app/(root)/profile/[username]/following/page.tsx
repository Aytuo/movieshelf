import { FollowUserList } from '@/components/follow/follow-user-list';
import { requireSession } from '@/lib/auth/require-session';
import { getUserFollowing } from '@/lib/services/follow-service';
import { getPublicProfile } from '@/lib/services/profile-service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type FollowingPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowingPage = async ({ params }: FollowingPageProps) => {
  const { username } = await params;
  const session = await requireSession();

  const profileData = await getPublicProfile(username, session.user.id);

  if (!profileData) {
    notFound();
  }

  const initialPage = await getUserFollowing(
    profileData.profile.userId,
    session.user.id
  );

  return (
    <main className="container-content py-10 lg:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/profile/${profileData.profile.username}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to profile
        </Link>

        <div className="mt-8 mb-7">
          <p className="eyebrow">Community</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Following
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            People followed by{' '}
            {profileData.profile.displayName ||
              `@${profileData.profile.username}`}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
          <FollowUserList
            profileUserId={profileData.profile.userId}
            mode="following"
            initialPage={initialPage}
          />
        </div>
      </div>
    </main>
  );
};

export default FollowingPage;
