'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/lib/services/notification-service';

export async function loadNotifications(cursor?: string) {
  const session = await requireSession();

  return getNotifications(session.user.id, {
    cursor,
    limit: 10,
  });
}

export async function loadUnreadNotificationCount() {
  const session = await requireSession();

  return getUnreadNotificationCount(session.user.id);
}

export async function markNotificationAsReadAction(notificationId: string) {
  const session = await requireSession();

  return markNotificationAsRead(session.user.id, notificationId);
}

export async function markAllNotificationsAsReadAction() {
  const session = await requireSession();

  return markAllNotificationsAsRead(session.user.id);
}
