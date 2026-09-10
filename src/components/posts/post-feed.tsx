'use client';

import { loadMoreMediaPosts } from '@/lib/actions/post-action';
import type { MediaType } from '@/lib/media';
import type { Post } from '@/types';
import { Loader2, MessageSquare } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import PostCard from './post-card';
import PostComposer from './post-composer';

type PostFeedProps = {
  initialPosts: Post[];
  initialCursor: string | null;
  type: MediaType;
  tmdbId: number;
};

function mergePosts(serverPosts: Post[], additionalPosts: Post[]): Post[] {
  const map = new Map(additionalPosts.map((post) => [post.id, post]));

  for (const post of serverPosts) {
    map.set(post.id, post);
  }

  return Array.from(map.values());
}

const PostFeed = ({
  initialPosts,
  initialCursor,
  type,
  tmdbId,
}: PostFeedProps) => {
  const [additionalPosts, setAdditionalPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState(initialCursor);

  const [isPending, startTransition] = useTransition();

  const posts = mergePosts(initialPosts, additionalPosts);

  function handlePostCreated(post: Post) {
    setAdditionalPosts((current) => [post, ...current]);
  }

  function handleLoadMore() {
    if (!cursor || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await loadMoreMediaPosts(type, tmdbId, cursor);

        setAdditionalPosts((current) => [...current, ...result.posts]);
        setCursor(result.nextCursor);
      } catch {
        toast.error("We couldn't load posts. Please try again.");
      }
    });
  }

  return (
    <div>
      <PostComposer type={type} tmdbId={tmdbId} onSuccess={handlePostCreated} />

      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} variant="preview" />
          ))}

          {cursor && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}

                {isPending ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
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
  );
};

export default PostFeed;
