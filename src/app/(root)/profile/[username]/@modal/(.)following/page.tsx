import { FollowListModal } from '@/components/follow/follow-list-modal';
import { FollowUserList } from '@/components/follow/follow-user-list';
import { requireSession } from '@/lib/auth/require-session';
import { getUserFollowing } from '@/lib/services/follow-service';
import { getPublicProfile } from '@/lib/services/profile-service';
import { notFound } from 'next/navigation';

type FollowingModalPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowingModalPage = async ({ params }: FollowingModalPageProps) => {
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

  const profileLabel =
    profileData.profile.displayName || `@${profileData.profile.username}`;

  return (
    <FollowListModal
      title="Following"
      description={`People followed by ${profileLabel}`}
    >
      <FollowUserList
        profileUserId={profileData.profile.userId}
        mode="following"
        initialPage={initialPage}
      />
    </FollowListModal>
  );
};

export default FollowingModalPage;
