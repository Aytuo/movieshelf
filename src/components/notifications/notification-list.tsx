'use client';

import {
  loadNotifications,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/lib/actions/notification-action';
import {
  formatNotificationDate,
  getNotificationHref,
  getNotificationIcon,
  getNotificationMessage,
} from '@/lib/notifications/notification-utils';
import type { Notification, NotificationPage } from '@/types';
import { Bell, CheckCheck, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type NotificationListProps = {
  initialPage: NotificationPage;
  initialUnreadCount: number;
};

const NotificationList = ({
  initialPage,
  initialUnreadCount,
}: NotificationListProps) => {
  const router = useRouter();

  const [items, setItems] = useState<Notification[]>(initialPage.notifications);

  const [currentCursor, setCurrentCursor] = useState(initialPage.nextCursor);

  const [hasMore, setHasMore] = useState(initialPage.hasMore);

  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  async function handleNotificationClick(notification: Notification) {
    if (!notification.readAt) {
      const success = await markNotificationAsReadAction(notification.id);

      if (success) {
        setUnreadCount((current) => Math.max(0, current - 1));

        setItems((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  readAt: new Date(),
                }
              : item
          )
        );
      }
    }

    router.push(getNotificationHref(notification));
  }

  async function handleMarkAllAsRead() {
    if (unreadCount === 0 || isMarkingAllRead) {
      return;
    }

    setIsMarkingAllRead(true);

    try {
      await markAllNotificationsAsReadAction();

      const readAt = new Date();

      setUnreadCount(0);

      setItems((current) =>
        current.map((notification) => ({
          ...notification,
          readAt,
        }))
      );
    } finally {
      setIsMarkingAllRead(false);
    }
  }

  async function handleLoadMore() {
    if (!currentCursor || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      const page = await loadNotifications(currentCursor);

      setItems((current) => [...current, ...page.notifications]);

      setCurrentCursor(page.nextCursor);
      setHasMore(page.hasMore);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Activity</p>

          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            Notifications
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Stay up to date with reactions, comments, and replies.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => void handleMarkAllAsRead()}
            disabled={isMarkingAllRead}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="size-4" />

            {isMarkingAllRead ? 'Saving…' : 'Mark all as read'}
          </button>
        )}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-surface">
        {items.length > 0 ? (
          <div className="divide-y divide-border/50">
            {items.map((notification) => {
              const Icon = getNotificationIcon(notification);

              const isUnread = notification.readAt === null;

              return (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void handleNotificationClick(notification)}
                  className={[
                    'flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover',
                    isUnread ? 'bg-surface-hover/40' : '',
                  ].join(' ')}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted-foreground">
                    <Icon className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={[
                        'text-sm leading-6',
                        isUnread
                          ? 'font-medium text-foreground'
                          : 'text-muted-foreground',
                      ].join(' ')}
                    >
                      {getNotificationMessage(notification)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatNotificationDate(notification.createdAt)}
                    </p>
                  </div>

                  {isUnread && (
                    <span
                      aria-hidden="true"
                      className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-surface-hover">
              <Bell className="size-5 text-muted-foreground" />
            </div>

            <h2 className="mt-4 font-heading text-xl font-semibold">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              When someone comments, replies, or reacts to your activity,
              you&apos;ll see it here.
            </p>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => void handleLoadMore()}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingMore && <LoaderCircle className="size-4 animate-spin" />}

            {isLoadingMore ? 'Loading…' : 'Load more notifications'}
          </button>
        </div>
      )}
    </section>
  );
};

export default NotificationList;
