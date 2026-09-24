import ProfileNavbar from '@/components/profile/profile-navbar';
import ProfilePostsList from '@/components/profile/profile-posts-list';
import { requireSession } from '@/lib/auth/require-session';
import { getPublicPosts } from '@/lib/services/profile-service';
import { notFound } from 'next/navigation';

type ProfilePostsPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePostsPage = async ({ params }: ProfilePostsPageProps) => {
  const { username } = await params;
  const session = await requireSession();

  const data = await getPublicPosts(username, session.user.id, {
    limit: 5,
  });

  if (!data) {
    notFound();
  }

  const { profile, posts, nextCursor } = data;

  return (
    <main className="container-content py-12 lg:py-16">
      <header>
        <p className="eyebrow">@{profile.username}</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Posts
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Posts published by this user.
        </p>

        <div className="mt-7">
          <ProfileNavbar username={profile.username} />
        </div>
      </header>

      <section className="py-10 lg:py-14">
        <ProfilePostsList
          username={profile.username}
          initialPosts={posts}
          initialNextCursor={nextCursor}
        />
      </section>
    </main>
  );
};

export default ProfilePostsPage;
