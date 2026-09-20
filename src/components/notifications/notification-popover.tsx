import type { Notification } from '@/types';
import { Bell, CheckCheck, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { NotificationItem } from './notification-item';

type NotificationPopoverProps = {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  isMarkingAllRead: boolean;
  onNotificationClick: (notification: Notification) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
};

export function NotificationPopover({
  notifications,
  unreadCount,
  isLoading,
  isMarkingAllRead,
  onNotificationClick,
  onMarkAllAsRead,
  onClose,
}: NotificationPopoverProps) {
  return (
    <div className="absolute top-11 right-0 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border/60 bg-background shadow-xl">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Notifications</h2>

          {unreadCount > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {unreadCount} unread
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0 || isMarkingAllRead}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck className="size-3.5" />
          {isMarkingAllRead ? 'Saving…' : 'Mark all as read'}
        </button>
      </div>

      <div className="max-h-[28rem] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center px-4 py-10">
            <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-border/50">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={onNotificationClick}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 py-10 text-center">
            <Bell className="mx-auto size-5 text-muted-foreground" />

            <p className="mt-3 text-sm font-medium">No notifications yet</p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              When something happens in your social activity, you&apos;ll see it
              here.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 px-4 py-3">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
