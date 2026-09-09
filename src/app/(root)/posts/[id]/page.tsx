import PostCard from '@/components/posts/post-card';
import { getPostById } from '@/lib/services/post-service';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
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

  const mediaPath = `/${post.media.type === 'movie' ? 'movie' : 'tv'}/${post.media.tmdbId}`;

  return (
    <main className="container-content py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href={mediaPath}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to {post.media.title}
        </Link>

        <div className="mt-8">
          <p className="eyebrow">Community post</p>

          <div className="mt-5">
            <PostCard post={post} variant="full" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostPage;
