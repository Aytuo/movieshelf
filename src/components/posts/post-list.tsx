import type { Post } from '@/types';
import { MessageSquare } from 'lucide-react';
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

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Discussion
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Start a conversation or join in with other viewers.
          </p>
        </div>

        <div>
          {posts.length > 0 ? (
            <PostFeed
              initialPosts={posts}
              initialCursor={postCursor}
              type={type}
              tmdbId={tmdbId}
            />
          ) : (
            <div className="rounded-2xl p-12 text-center surface">
              <MessageSquare className="mx-auto size-6 text-muted-foreground" />

              <h3 className="mt-4 font-heading text-xl font-semibold">
                No posts yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Be the first to start a conversation about this{' '}
                {type === 'movie' ? 'movie' : 'TV series'}.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostList;
