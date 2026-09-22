import FollowListRoute from '@/components/follow/follow-list-route';

type FollowingModalPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowingModalPage = async ({ params }: FollowingModalPageProps) => {
  const { username } = await params;

  return (
    <FollowListRoute username={username} mode="following" variant="modal" />
  );
};

export default FollowingModalPage;
