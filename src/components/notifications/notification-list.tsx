'use client';

import {
  clearNotificationsAction,
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
import { Bell, CheckCheck, LoaderCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import EmptyState from '../ui/empty-state';

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

  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const [isClearing, setIsClearing] = useState(false);

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

        window.dispatchEvent(new Event('movieshelf:notifications-updated'));

        router.refresh();
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

      window.dispatchEvent(new Event('movieshelf:notifications-updated'));

      router.refresh();
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

  async function handleClearNotifications() {
    if (isClearing) {
      return;
    }

    setIsClearing(true);

    try {
      await clearNotificationsAction();

      setItems([]);
      setCurrentCursor(null);
      setHasMore(false);
      setUnreadCount(0);

      window.dispatchEvent(new Event('movieshelf:notifications-updated'));

      setIsClearDialogOpen(false);

      router.refresh();
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <>
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

          <div className="flex shrink-0 items-center gap-4">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void handleMarkAllAsRead()}
                disabled={isMarkingAllRead}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck className="size-4" />

                {isMarkingAllRead ? 'Saving…' : 'Mark all as read'}
              </button>
            )}

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearDialogOpen(true)}
                disabled={isClearing}
                className="inline-flex items-center gap-2 text-sm font-semibold text-destructive transition-colors hover:text-destructive/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-4" />
                Clear
              </button>
            )}
          </div>
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
            <div className="px-6 py-16">
              <EmptyState
                icon={Bell}
                title="No notifications yet"
                description="When someone comments, replies, or reacts to your activity, you'll see it here."
              />
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
              {isLoadingMore && (
                <LoaderCircle className="size-4 animate-spin" />
              )}

              {isLoadingMore ? 'Loading…' : 'Load more notifications'}
            </button>
          </div>
        )}
      </section>

      <Dialog
        open={isClearDialogOpen}
        onOpenChange={(open) => {
          if (!isClearing) {
            setIsClearDialogOpen(open);
          }
        }}
      >
        <DialogContent className="gap-0 sm:max-w-md">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Trash2 className="size-5" />
          </div>

          <DialogHeader className="mt-5 text-center">
            <DialogTitle className="font-heading text-xl">
              Clear all notifications?
            </DialogTitle>

            <DialogDescription className="mt-2 leading-6">
              This will permanently remove all of your notifications. You
              won&apos;t be able to undo this action.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setIsClearDialogOpen(false)}
              disabled={isClearing}
              className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-surface px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-border hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void handleClearNotifications()}
              disabled={isClearing}
              className="inline-flex items-center justify-center rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isClearing && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}
              {isClearing ? 'Clearing…' : 'Clear notifications'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationList;
