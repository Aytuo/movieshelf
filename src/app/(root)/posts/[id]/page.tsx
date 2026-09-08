import PostCard from '@/components/posts/post-card';
import { getPostById } from '@/lib/services/post-service';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: 'Post not found | MovieShelf',
    };
  }

  return {
    title: `${post.title} | MovieShelf`,
    description: post.content.slice(0, 160),
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="container-content py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Community post</p>

        <div className="mt-5">
          <PostCard post={post} variant="full" />
        </div>
      </div>
    </main>
  );
};

export default PostPage;
