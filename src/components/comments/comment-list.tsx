'use client';

import type { Comment } from '@/types';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import CommentCard from './comment-card';
import CommentComposer from './comment-composer';
import CommentForm from './comment-form';

type CommentListProps = {
  postId: string;
  comments: Comment[];
};

const CommentList = ({ postId, comments }: CommentListProps) => {
  const [items, setItems] = useState(comments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  function handleCommentCreated(comment: Comment) {
    setItems((current) => [comment, ...current]);
  }

  function handleReplyCreated(comment: Comment) {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== comment.parentId) {
          return item;
        }

        return {
          ...item,
          replies: [...item.replies, comment],
        };
      })
    );

    setReplyingTo(null);
  }

  return (
    <section className="mt-12 border-t border-border/60 pt-10">
      <div className="mb-8">
        <p className="eyebrow">Community</p>

        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Comments
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Join the conversation and share your thoughts with other viewers.
        </p>
      </div>

      <CommentComposer postId={postId} onSuccess={handleCommentCreated} />

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentCard
                comment={comment}
                onReply={(commentId) => setReplyingTo(commentId)}
              />

              {replyingTo === comment.id && (
                <div className="ml-8 rounded-2xl p-5 surface sm:ml-12">
                  <CommentForm
                    postId={postId}
                    parentId={comment.id}
                    onSuccess={handleReplyCreated}
                    onCancel={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
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
