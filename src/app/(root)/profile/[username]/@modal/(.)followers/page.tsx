import { FollowListModal } from '@/components/follow/follow-list-modal';
import { FollowUserList } from '@/components/follow/follow-user-list';
import { requireSession } from '@/lib/auth/require-session';
import { getUserFollowers } from '@/lib/services/follow-service';
import { getPublicProfile } from '@/lib/services/profile-service';
import { notFound } from 'next/navigation';

type FollowersModalPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowersModalPage = async ({ params }: FollowersModalPageProps) => {
  const { username } = await params;
  const session = await requireSession();

  const profileData = await getPublicProfile(username, session.user.id);

  if (!profileData) {
    notFound();
  }

  const initialPage = await getUserFollowers(
    profileData.profile.userId,
    session.user.id
  );

  const profileLabel =
    profileData.profile.displayName || `@${profileData.profile.username}`;

  return (
    <FollowListModal
      title="Followers"
      description={`People following ${profileLabel}`}
    >
      <FollowUserList
        profileUserId={profileData.profile.userId}
        mode="followers"
        initialPage={initialPage}
      />
    </FollowListModal>
  );
};

export default FollowersModalPage;
