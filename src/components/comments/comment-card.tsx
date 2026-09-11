'use client';

import type { Comment } from '@/types';
import { MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';
import CommentForm from './comment-form';
import { CommentReactionButton } from './comment-reaction-button';

type CommentCardProps = {
  comment: Comment;
  postId: string;
  mediaType: 'movie' | 'tv';
  depth?: number;
  replyingTo?: string | null;
  onReply?: (commentId: string) => void;
  onReplyCreated?: (comment: Comment) => void;
  onReplyCancel?: () => void;
};

function formatCommentDate(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

const CommentCard = ({
  comment,
  postId,
  mediaType,
  depth = 0,
  replyingTo,
  onReply,
  onReplyCreated,
  onReplyCancel,
}: CommentCardProps) => {
  const { author } = comment;

  const authorLabel = author.displayName || `@${author.username}`;

  const isReply = depth > 0;
  const isReplying = replyingTo === comment.id;

  return (
    <article
      className={
        isReply
          ? 'relative'
          : 'rounded-2xl border border-border/60 bg-surface p-5'
      }
    >
      <div className="flex items-start gap-3">
        <Link
          href={`/profile/${author.username}`}
          className="group flex shrink-0"
        >
          <div
            className={[
              'flex items-center justify-center overflow-hidden rounded-full bg-surface-hover text-xs font-semibold',
              isReply ? 'size-8' : 'size-9',
            ].join(' ')}
          >
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              author.username.slice(0, 1).toUpperCase()
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Link
                href={`/profile/${author.username}`}
                className="text-sm font-semibold transition-colors hover:text-primary"
              >
                {authorLabel}
              </Link>

              <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate">@{author.username}</span>

                {author.rating !== null && (
                  <>
                    <span aria-hidden="true">·</span>

                    <span className="inline-flex min-w-0 items-center gap-1">
                      <span className="truncate">
                        rated this{' '}
                        {mediaType === 'movie' ? 'movie' : 'TV series'}
                      </span>

                      <span className="inline-flex shrink-0 items-center gap-0.5 font-semibold text-foreground">
                        {author.rating}/10
                        <Star
                          className="size-3 fill-current"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </>
                )}
              </p>
            </div>

            <time
              dateTime={comment.createdAt.toISOString()}
              title={comment.createdAt.toLocaleString()}
              className="shrink-0 text-xs text-muted-foreground"
            >
              {formatCommentDate(comment.createdAt)}
            </time>
          </div>

          <p className="mt-4 rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 whitespace-pre-line text-foreground/80">
            {comment.content}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onReply?.(comment.id)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="size-3.5" />
              Reply
            </button>

            <CommentReactionButton
              commentId={comment.id}
              count={comment.reactionCount}
              reacted={comment.viewerHasReacted}
            />
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="mt-4 border-t border-border/50 pt-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={onReplyCreated}
            onCancel={onReplyCancel}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <div
          className={
            isReply
              ? 'relative mt-5 ml-4 pl-6 sm:ml-5'
              : 'relative mt-5 ml-8 pl-6 sm:ml-9'
          }
        >
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="group/reply relative pb-4 pl-6 last:pb-0"
            >
              {/* Vertical branch */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-0 h-full border-l border-border/60 group-last/reply:h-0"
              />

              {/* Rounded branch */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-0 h-7 w-6 rounded-bl-2xl border-b border-l border-border/60"
              />

              <CommentCard
                comment={reply}
                postId={postId}
                mediaType={mediaType}
                depth={depth + 1}
                replyingTo={replyingTo}
                onReply={onReply}
                onReplyCreated={onReplyCreated}
                onReplyCancel={onReplyCancel}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentCard;
