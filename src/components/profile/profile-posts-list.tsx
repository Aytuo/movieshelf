'use client';

import PostCard from '@/components/posts/post-card';
import { loadProfilePostsAction } from '@/lib/actions/profile-post-action';
import type { Post } from '@/types';
import { LoaderCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import EmptyState from '../ui/empty-state';

type ProfilePostsListProps = {
  username: string;
  initialPosts: Post[];
  initialNextCursor: string | null;
};

const ProfilePostsList = ({
  username,
  initialPosts,
  initialNextCursor,
}: ProfilePostsListProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const hasMore = nextCursor !== null;

  async function handleLoadMore() {
    if (!nextCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const page = await loadProfilePostsAction(username, nextCursor);

      if (!page) {
        return;
      }

      setPosts((current) => [...current, ...page.posts]);

      setNextCursor(page.nextCursor);

      setNextCursor(page.nextCursor);
    } finally {
      setIsLoadingMore(false);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl p-12 surface">
        <EmptyState
          icon={MessageSquare}
          title="No posts yet"
          description="Posts published by this user will appear here."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => void handleLoadMore()}
            disabled={isLoadingMore}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingMore && <LoaderCircle className="size-4 animate-spin" />}

            {isLoadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePostsList;
