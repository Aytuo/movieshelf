import {
  createNotification as createNotificationRepository,
  getCommentAuthorId,
  getCommentContext,
  getNotifications as getNotificationsRepository,
  getPostAuthorId,
  getUnreadNotificationCount as getUnreadNotificationCountRepository,
  markAllNotificationsAsRead as markAllNotificationsAsReadRepository,
  markNotificationAsRead as markNotificationAsReadRepository,
} from '@/lib/repositories';
import { NotificationPage } from '@/types';

export async function notifyCommentCreated(data: {
  actorId: string;
  postId: string;
  commentId: string;
  parentId: string | null;
}) {
  let recipientId: string | null = null;

  const type = data.parentId ? 'comment_reply' : 'post_comment';

  if (data.parentId) {
    recipientId = await getCommentAuthorId(data.parentId);
  } else {
    recipientId = await getPostAuthorId(data.postId);
  }

  if (!recipientId || recipientId === data.actorId) {
    return null;
  }

  return createNotificationRepository({
    recipientId,
    actorId: data.actorId,
    type,
    postId: data.postId,
    commentId: data.commentId,
  });
}

export async function notifyPostLiked(data: {
  actorId: string;
  postId: string;
}) {
  const recipientId = await getPostAuthorId(data.postId);

  if (!recipientId || recipientId === data.actorId) {
    return null;
  }

  return createNotificationRepository({
    recipientId,
    actorId: data.actorId,
    type: 'post_like',
    postId: data.postId,
  });
}

export async function notifyCommentLiked(data: {
  actorId: string;
  commentId: string;
}) {
  const context = await getCommentContext(data.commentId);

  if (!context || context.authorId === data.actorId) {
    return null;
  }

  return createNotificationRepository({
    recipientId: context.authorId,
    actorId: data.actorId,
    type: 'comment_like',
    postId: context.postId,
    commentId: data.commentId,
  });
}

export async function getNotifications(
  userId: string,
  options?: {
    cursor?: string;
    limit?: number;
  }
): Promise<NotificationPage> {
  return getNotificationsRepository(userId, options);
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  return getUnreadNotificationCountRepository(userId);
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  return markNotificationAsReadRepository(notificationId, userId);
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<number> {
  return markAllNotificationsAsReadRepository(userId);
}
