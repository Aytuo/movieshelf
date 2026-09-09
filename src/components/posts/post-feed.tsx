'use client';

import { loadMoreMediaPosts } from '@/lib/actions/post-action';
import type { MediaType } from '@/lib/media';
import type { Post } from '@/types';
import { Loader2 } from 'lucide-react';
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

const PostFeed = ({
  initialPosts,
  initialCursor,
  type,
  tmdbId,
}: PostFeedProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();

  function handlePostCreated(post: Post) {
    setPosts((current) => [post, ...current]);
  }

  function handleLoadMore() {
    if (!cursor || isPending) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await loadMoreMediaPosts(type, tmdbId, cursor);

        setPosts((current) => [...current, ...result.posts]);
        setCursor(result.nextCursor);
      } catch {
        toast.error("We couldn't load posts. Please try again.");
      }
    });
  }

  return (
    <div>
      <PostComposer type={type} tmdbId={tmdbId} onSuccess={handlePostCreated} />

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
    </div>
  );
};

export default PostFeed;
