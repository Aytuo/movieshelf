'use client';

import {
  deleteCommentAction,
  editCommentAction,
  loadCommentReplies,
} from '@/lib/actions/comment-action';
import type { Comment } from '@/types';
import { CornerDownRight, MessagesSquare, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import CommentForm from './comment-form';
import { CommentReactionButton } from './comment-reaction-button';

type CommentCardProps = {
  comment: Comment;
  postId: string;
  mediaType: 'movie' | 'tv';
  depth?: number;
  viewerUserId?: string;
  onCommentCountChange?: (delta: number) => void;
  onDeleted?: () => void;
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
  viewerUserId,
  onCommentCountChange,
  onDeleted,
}: CommentCardProps) => {
  const { author } = comment;

  const authorLabel = author.displayName || `@${author.username}`;

  const isReply = depth > 0;
  const isOwner = viewerUserId === author.userId;

  const [displayContent, setDisplayContent] = useState(comment.content);

  const [editContent, setEditContent] = useState(comment.content);

  const [updatedAt, setUpdatedAt] = useState(comment.updatedAt);

  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [isDeleted, setIsDeleted] = useState(comment.deletedAt !== null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [replies, setReplies] = useState<Comment[] | undefined>(
    comment.replies
  );

  const [replyCount, setReplyCount] = useState(comment.replyCount);

  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  const [isRepliesOpen, setIsRepliesOpen] = useState(
    comment.replies !== undefined
  );

  const [isReplying, setIsReplying] = useState(false);

  async function handleToggleReplies() {
    if (isRepliesOpen) {
      setIsRepliesOpen(false);
      return;
    }

    if (replies !== undefined) {
      setIsRepliesOpen(true);
      return;
    }

    setIsLoadingReplies(true);

    try {
      const loaded = await loadCommentReplies(postId, comment.id);

      setReplies(loaded);
      setIsRepliesOpen(true);
    } finally {
      setIsLoadingReplies(false);
    }
  }

  function handleReplyCreated(createdComment: Comment) {
    setReplies((current) => [...(current ?? []), createdComment]);

    setReplyCount((current) => current + 1);

    setIsReplying(false);
    setIsRepliesOpen(true);

    onCommentCountChange?.(1);
  }

  async function handleEditSubmit() {
    if (isSavingEdit) {
      return;
    }

    const content = editContent.trim();

    if (!content) {
      return;
    }

    setIsSavingEdit(true);

    try {
      const updated = await editCommentAction({
        commentId: comment.id,
        content,
      });

      setDisplayContent(updated.content);
      setEditContent(updated.content);
      setUpdatedAt(updated.updatedAt);
      setIsEditing(false);
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDelete() {
    if (isDeleting || isDeleted) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteCommentAction({
        commentId: comment.id,
      });

      setIsDeleted(true);
      setShowDeleteConfirmation(false);

      onCommentCountChange?.(-1);

      if (isReply) {
        onDeleted?.();
      }
    } finally {
      setIsDeleting(false);
    }
  }

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

            <div className="flex shrink-0 items-center gap-1.5">
              <time
                dateTime={updatedAt.toISOString()}
                title={updatedAt.toLocaleString()}
                className="text-xs text-muted-foreground"
              >
                {formatCommentDate(updatedAt)}
              </time>

              {updatedAt.getTime() > comment.createdAt.getTime() && (
                <span className="text-xs text-muted-foreground">· edited</span>
              )}
            </div>
          </div>

          {isDeleted ? (
            <div className="mt-4 rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 text-muted-foreground italic">
              This comment was deleted.
            </div>
          ) : isEditing ? (
            <div className="mt-4">
              <textarea
                value={editContent}
                onChange={(event) => setEditContent(event.target.value)}
                rows={4}
                autoFocus
                disabled={isSavingEdit}
                className="w-full resize-none rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 text-foreground transition-colors outline-none focus:border-primary/50 disabled:opacity-60"
              />

              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditContent(displayContent);
                    setIsEditing(false);
                  }}
                  disabled={isSavingEdit}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={isSavingEdit || editContent.trim().length === 0}
                  className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 whitespace-pre-line text-foreground/80">
              {displayContent}
            </p>
          )}

          {!isDeleted && !isEditing && (
            <div className="mt-4 flex flex-wrap items-center gap-y-2">
              <div className="flex items-center gap-4">
                {!isReply && (
                  <button
                    type="button"
                    onClick={() => setIsReplying((current) => !current)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <CornerDownRight className="size-3.5" />
                    Reply
                  </button>
                )}

                {replyCount > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleReplies}
                    disabled={isLoadingReplies}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    <MessagesSquare className="size-3.5" />

                    {isLoadingReplies
                      ? 'Loading…'
                      : isRepliesOpen
                        ? 'Hide replies'
                        : `${replyCount} ${
                            replyCount === 1 ? 'reply' : 'replies'
                          }`}
                  </button>
                )}

                <CommentReactionButton
                  commentId={comment.id}
                  count={comment.reactionCount}
                  reacted={comment.viewerHasReacted}
                />
              </div>

              {isOwner && (
                <>
                  <span
                    aria-hidden="true"
                    className="mx-3 hidden h-4 w-px bg-border/60 sm:block"
                  />

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditContent(displayContent);
                        setIsEditing(true);
                      }}
                      className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirmation(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {isDeleted && replyCount > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleToggleReplies}
                disabled={isLoadingReplies}
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                <MessagesSquare className="size-3.5" />

                {isLoadingReplies
                  ? 'Loading…'
                  : isRepliesOpen
                    ? 'Hide replies'
                    : `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
              </button>
            </div>
          )}

          {showDeleteConfirmation && !isDeleted && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/60 bg-surface-hover/30 px-3 py-2">
              <span className="mr-auto text-xs text-muted-foreground">
                Delete this comment?
              </span>

              <button
                type="button"
                onClick={() => setShowDeleteConfirmation(false)}
                disabled={isDeleting}
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs font-semibold text-destructive transition-colors hover:text-destructive/80 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

      {!isReply && isReplying && !isDeleted && (
        <div className="mt-4 border-t border-border/50 pt-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={handleReplyCreated}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {isRepliesOpen && replies && replies.length > 0 && (
        <div className="relative mt-5 ml-8 pl-6 sm:ml-9">
          {replies.map((reply) => (
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
                depth={1}
                viewerUserId={viewerUserId}
                onCommentCountChange={onCommentCountChange}
                onDeleted={() => {
                  setReplies((current) =>
                    current?.filter(
                      (currentReply) => currentReply.id !== reply.id
                    )
                  );

                  setReplyCount((current) => Math.max(0, current - 1));
                }}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentCard;
