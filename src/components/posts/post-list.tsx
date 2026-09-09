import type { Post } from '@/types';
import PostFeed from './post-feed';

type PostListProps = {
  posts: Post[];
  postCursor: string | null;
  type: Post['media']['type'];
  tmdbId: number;
};

const PostList = ({ posts, postCursor, type, tmdbId }: PostListProps) => {
  return (
    <section className="border-t border-border/60">
      <div className="container-content py-14 lg:py-20">
        <div className="mb-8">
          <p className="eyebrow">From the community</p>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
            Discussion
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Start a conversation or join in with other viewers.
          </p>
        </div>

        <PostFeed
          initialPosts={posts}
          initialCursor={postCursor}
          type={type}
          tmdbId={tmdbId}
        />
      </div>
    </section>
  );
};

export default PostList;
