import type { Post } from '@/types';
import { MessageSquare } from 'lucide-react';
import PostCard from './post-card';
import PostForm from './post-form';

type PostListProps = {
  posts: Post[];
  type: Post['media']['type'];
  tmdbId: number;
};

const PostList = ({ posts, type, tmdbId }: PostListProps) => {
  const visiblePosts = posts.slice(0, 5);

  return (
    <section className="border-t border-border/60">
      <div className="container-content py-14 lg:py-20">
        <div className="mb-8">
          <p className="eyebrow">From the community</p>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Posts
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Share a thought and see what other people are saying about this{' '}
            {type === 'movie' ? 'movie' : 'TV series'}.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="rounded-2xl p-5 surface sm:p-7">
            <PostForm type={type} tmdbId={tmdbId} />
          </div>

          <div>
            {posts.length > 0 ? (
              <div className="space-y-4">
                {visiblePosts.map((post) => (
                  <PostCard key={post.id} post={post} variant="preview" />
                ))}
              </div>
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
      </div>
    </section>
  );
};

export default PostList;
