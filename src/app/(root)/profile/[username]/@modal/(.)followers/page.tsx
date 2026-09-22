import FollowListRoute from '@/components/follow/follow-list-route';

type FollowersModalPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowersModalPage = async ({ params }: FollowersModalPageProps) => {
  const { username } = await params;

  return (
    <FollowListRoute username={username} mode="followers" variant="modal" />
  );
};

export default FollowersModalPage;
