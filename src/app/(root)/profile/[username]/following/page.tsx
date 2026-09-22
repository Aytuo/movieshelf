import FollowListRoute from '@/components/follow/follow-list-route';

type FollowingPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const FollowingPage = async ({ params }: FollowingPageProps) => {
  const { username } = await params;

  return (
    <FollowListRoute username={username} mode="following" variant="page" />
  );
};

export default FollowingPage;
