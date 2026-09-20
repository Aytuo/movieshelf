import { CornerDownRight, MessagesSquare, Trash2 } from 'lucide-react';
import { CommentReactionButton } from './comment-reaction-button';

type CommentActionsProps = {
  commentId: string;
  isReply: boolean;
  replyCount: number;
  isRepliesOpen: boolean;
  isLoadingReplies: boolean;
  isOwner: boolean;
  reactionCount: number;
  viewerHasReacted: boolean;
  onReply: () => void;
  onToggleReplies: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function CommentActions({
  commentId,
  isReply,
  replyCount,
  isRepliesOpen,
  isLoadingReplies,
  isOwner,
  reactionCount,
  viewerHasReacted,
  onReply,
  onToggleReplies,
  onEdit,
  onDelete,
}: CommentActionsProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-y-2">
      <div className="flex items-center gap-4">
        {!isReply && (
          <button
            type="button"
            onClick={onReply}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <CornerDownRight className="size-3.5" />
            Reply
          </button>
        )}

        {replyCount > 0 && (
          <button
            type="button"
            onClick={onToggleReplies}
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
        )}

        <CommentReactionButton
          commentId={commentId}
          count={reactionCount}
          reacted={viewerHasReacted}
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
              onClick={onEdit}
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
