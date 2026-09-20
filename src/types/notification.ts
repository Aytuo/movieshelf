export type NotificationType =
  'post_comment' | 'comment_reply' | 'post_like' | 'comment_like';

export type Notification = {
  id: string;

  recipientId: string;
  actorId: string;

  type: NotificationType;

  postId: string | null;
  commentId: string | null;

  readAt: Date | null;
  createdAt: Date;

  actor: {
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type NotificationPage = {
  notifications: Notification[];
  nextCursor: string | null;
  hasMore: boolean;
};
