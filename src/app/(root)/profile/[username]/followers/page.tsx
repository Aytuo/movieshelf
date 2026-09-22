import FollowListRoute from '@/components/follow/follow-list-route';

type FollowersPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowersPage = async ({ params }: FollowersPageProps) => {
  const { username } = await params;

  return (
    <FollowListRoute username={username} mode="followers" variant="page" />
  );
};

export default FollowersPage;
