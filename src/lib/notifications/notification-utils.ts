import type { Notification, NotificationType } from '@/types';
import {
  Bell,
  Heart,
  MessageCircle,
  MessageSquareReply,
  UserPlus,
} from 'lucide-react';

export const notificationIconMap: Record<NotificationType, typeof Bell> = {
  post_comment: MessageCircle,
  comment_reply: MessageSquareReply,
  post_like: Heart,
  comment_like: Heart,
  user_follow: UserPlus,
} as const;

export function getNotificationMessage(notification: Notification) {
  const actor =
    notification.actor.displayName || `@${notification.actor.username}`;

  switch (notification.type) {
    case 'post_comment':
      return `${actor} commented on your post.`;

    case 'comment_reply':
      return `${actor} replied to your comment.`;

    case 'post_like':
      return `${actor} liked your post.`;

    case 'comment_like':
      return `${actor} liked your comment.`;

    case 'user_follow':
      return `${notification.actor.displayName || `@${notification.actor.username}`} started following you.`;

    default:
      return 'You have a new notification.';
  }
}

export function getNotificationIcon(notification: Notification) {
  return notificationIconMap[notification.type];
}

export function getNotificationHref(notification: Notification) {
  if (notification.postId) {
    return `/posts/${notification.postId}`;
  }

  return '/notifications';
}

export function formatNotificationDate(date: Date) {
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
