'use client';

import type { Comment } from '@/types';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import CommentCard from './comment-card';
import CommentComposer from './comment-composer';

type CommentListProps = {
  postId: string;
  comments: Comment[];
};

function appendReply(
  comments: Comment[],
  parentId: string,
  reply: Comment
): Comment[] {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...comment.replies, reply],
      };
    }

    if (comment.replies.length === 0) {
      return comment;
    }

    return {
      ...comment,
      replies: appendReply(comment.replies, parentId, reply),
    };
  });
}

const CommentList = ({ postId, comments }: CommentListProps) => {
  const [items, setItems] = useState(comments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  function handleCommentCreated(comment: Comment) {
    setItems((current) => [comment, ...current]);
  }

  function handleReplyCreated(comment: Comment) {
    const parentId = comment.parentId;

    if (!parentId) {
      return;
    }

    setItems((current) => appendReply(current, parentId, comment));

    setReplyingTo(null);
  }

  return (
    <section id="comments" className="mt-12 border-t border-border/60 pt-10">
      <div className="mb-8">
        <p className="eyebrow">Community</p>

        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
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
            <CommentCard
              key={comment.id}
              comment={comment}
              postId={postId}
              replyingTo={replyingTo}
              onReply={setReplyingTo}
              onReplyCreated={handleReplyCreated}
              onReplyCancel={() => setReplyingTo(null)}
            />
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
