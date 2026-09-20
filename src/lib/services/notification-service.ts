import {
  createNotification as createNotificationRepository,
  getCommentAuthorId,
  getPostAuthorId,
} from '@/lib/repositories';

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
  const recipientId = await getCommentAuthorId(data.commentId);

  if (!recipientId || recipientId === data.actorId) {
    return null;
  }

  return createNotificationRepository({
    recipientId,
    actorId: data.actorId,
    type: 'comment_like',
    commentId: data.commentId,
  });
}
