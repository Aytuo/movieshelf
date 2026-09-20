import NotificationList from '@/components/notifications/notification-list';
import { requireSession } from '@/lib/auth/require-session';
import {
  getNotifications,
  getUnreadNotificationCount,
} from '@/lib/services/notification-service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notifications | MovieShelf',
};

const NotificationsPage = async () => {
  const session = await requireSession();

  const [page, unreadCount] = await Promise.all([
    getNotifications(session.user.id, {
      limit: 20,
    }),
    getUnreadNotificationCount(session.user.id),
  ]);

  return (
    <main className="container-content py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <NotificationList initialPage={page} initialUnreadCount={unreadCount} />
      </div>
    </main>
  );
};

export default NotificationsPage;
