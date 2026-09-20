import {
  deleteCommentAction,
  editCommentAction,
  loadCommentReplies,
} from '@/lib/actions/comment-action';
import type { Comment } from '@/types';
import { useState } from 'react';

type UseCommentProps = {
  comment: Comment;
  postId: string;
  isReply: boolean;
  onCommentCountChange?: (delta: number) => void;
  onDeleted?: () => void;
};

export function useComment({
  comment,
  postId,
  isReply,
  onCommentCountChange,
  onDeleted,
}: UseCommentProps) {
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

  function startEditing() {
    setEditContent(displayContent);
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditContent(displayContent);
    setIsEditing(false);
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

  function handleReplyDeleted(replyId: string) {
    setReplies((current) => current?.filter((reply) => reply.id !== replyId));

    setReplyCount((current) => Math.max(0, current - 1));
  }

  return {
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
  };
}
