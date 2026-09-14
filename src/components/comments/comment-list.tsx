'use client';

import { loadPostComments } from '@/lib/actions/comment-action';
import type { Comment } from '@/types';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import CommentCard from './comment-card';
import CommentComposer from './comment-composer';

type CommentListProps = {
  postId: string;
  comments: Comment[];
  commentCount: number;
  nextCursor: string | null;
  hasMore: boolean;
  mediaType: 'movie' | 'tv';
};

const CommentList = ({
  postId,
  comments,
  commentCount,
  nextCursor,
  hasMore: initialHasMore,
  mediaType,
}: CommentListProps) => {
  const [items, setItems] = useState(comments);
  const [currentCursor, setCurrentCursor] = useState(nextCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentCommentCount, setCurrentCommentCount] = useState(commentCount);

  function handleCommentCreated(comment: Comment) {
    setItems((current) => [comment, ...current]);

    setCurrentCommentCount((current) => current + 1);
  }

  async function handleLoadMore() {
    if (!currentCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const page = await loadPostComments(postId, currentCursor);

      setItems((current) => [...current, ...page.comments]);

      setCurrentCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <section id="comments" className="mt-12 border-t border-border/60 pt-10">
      <div className="mb-8">
        <p className="eyebrow">Community</p>

        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
          Comments
          {currentCommentCount > 0 && (
            <span className="ml-2 text-muted-foreground">
              {currentCommentCount}
            </span>
          )}
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Join the conversation and share your thoughts with other viewers.
        </p>
      </div>

      <CommentComposer postId={postId} onSuccess={handleCommentCreated} />

      {items.length > 0 ? (
        <>
          <div className="space-y-4">
            {items.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                postId={postId}
                mediaType={mediaType}
                onCommentCountChange={(delta) =>
                  setCurrentCommentCount((current) => current + delta)
                }
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? 'Loading…' : 'Load more comments'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl p-12 text-center surface">
          <MessageCircle className="mx-auto size-6 text-muted-foreground" />

          <h3 className="mt-4 font-heading text-xl font-semibold">
            No comments yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Be the first to join the conversation.
          </p>
        </div>
      )}
    </section>
  );
};

export default CommentList;
