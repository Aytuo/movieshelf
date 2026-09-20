'use client';

import { useComment } from '@/hooks/use-comment';
import type { Comment } from '@/types';
import Link from 'next/link';
import { CommentActions } from './comment-actions';
import { CommentDeleteConfirmation } from './comment-delete-confirmation';
import { CommentEditForm } from './comment-edit-form';
import CommentForm from './comment-form';
import { CommentHeader } from './comment-header';

type CommentCardProps = {
  comment: Comment;
  postId: string;
  mediaType: 'movie' | 'tv';
  depth?: number;
  viewerUserId?: string;
  onCommentCountChange?: (delta: number) => void;
  onDeleted?: () => void;
};

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

  const isReply = depth > 0;
  const isOwner = viewerUserId === author.userId;

  const {
    displayContent,
    editContent,
    setEditContent,
    updatedAt,

    isEditing,
    isSavingEdit,
    startEditing,
    cancelEditing,
    handleEditSubmit,

    isDeleted,
    isDeleting,
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    handleDelete,

    replies,
    replyCount,
    isLoadingReplies,
    isRepliesOpen,
    handleToggleReplies,

    isReplying,
    setIsReplying,
    handleReplyCreated,
    handleReplyDeleted,
  } = useComment({
    comment,
    postId,
    isReply,
    onCommentCountChange,
    onDeleted,
  });

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
          <CommentHeader
            author={author}
            mediaType={mediaType}
            updatedAt={updatedAt}
            createdAt={comment.createdAt}
          />

          {isDeleted ? (
            <div className="mt-4 rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 text-muted-foreground italic">
              This comment was deleted.
            </div>
          ) : isEditing ? (
            <CommentEditForm
              value={editContent}
              onChange={setEditContent}
              onCancel={cancelEditing}
              onSubmit={handleEditSubmit}
              isSaving={isSavingEdit}
            />
          ) : (
            <p className="mt-4 rounded-xl border border-border/70 bg-surface-hover/40 px-4 py-3 text-sm leading-7 whitespace-pre-line text-foreground/80">
              {displayContent}
            </p>
          )}

          {!isDeleted && !isEditing && (
            <CommentActions
              commentId={comment.id}
              isReply={isReply}
              replyCount={replyCount}
              isRepliesOpen={isRepliesOpen}
              isLoadingReplies={isLoadingReplies}
              isOwner={isOwner}
              reactionCount={comment.reactionCount}
              viewerHasReacted={comment.viewerHasReacted}
              onReply={() => setIsReplying((current) => !current)}
              onToggleReplies={handleToggleReplies}
              onEdit={startEditing}
              onDelete={() => setShowDeleteConfirmation(true)}
            />
          )}

          {isDeleted && replyCount > 0 && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleToggleReplies}
                disabled={isLoadingReplies}
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                {isLoadingReplies
                  ? 'Loading…'
                  : isRepliesOpen
                    ? 'Hide replies'
                    : `${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
              </button>
            </div>
          )}

          {showDeleteConfirmation && !isDeleted && (
            <CommentDeleteConfirmation
              isDeleting={isDeleting}
              onCancel={() => setShowDeleteConfirmation(false)}
              onConfirm={handleDelete}
            />
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
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-0 h-full border-l border-border/60 group-last/reply:h-0"
              />

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
                onDeleted={() => handleReplyDeleted(reply.id)}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentCard;
