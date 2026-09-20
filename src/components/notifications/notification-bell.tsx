'use client';

import {
  loadNotifications,
  loadUnreadNotificationCount,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/lib/actions/notification-action';
import {
  formatNotificationDate,
  getNotificationHref,
  getNotificationIcon,
  getNotificationMessage,
} from '@/lib/notifications/notification-utils';
import type { Notification } from '@/types';
import { Bell, CheckCheck, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  async function refreshUnreadCount() {
    try {
      const count = await loadUnreadNotificationCount();

      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notification count:', error);
    }
  }

  async function handleOpen() {
    const nextOpen = !isOpen;

    setIsOpen(nextOpen);

    if (!nextOpen) {
      return;
    }

    setIsLoading(true);

    try {
      const [page] = await Promise.all([
        loadNotifications(),
        refreshUnreadCount(),
      ]);

      setNotifications(page.notifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleNotificationClick(notification: Notification) {
    if (notification.readAt) {
      return;
    }

    const success = await markNotificationAsReadAction(notification.id);

    if (!success) {
      return;
    }

    setUnreadCount((current) => Math.max(0, current - 1));

    setNotifications((current) =>
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

  async function handleMarkAllAsRead() {
    if (unreadCount === 0 || isMarkingAllRead) {
      return;
    }

    setIsMarkingAllRead(true);

    try {
      await markAllNotificationsAsReadAction();

      const readAt = new Date();

      setUnreadCount(0);

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          readAt,
        }))
      );
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    } finally {
      setIsMarkingAllRead(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    loadUnreadNotificationCount()
      .then((count) => {
        if (!cancelled) {
          setUnreadCount(count);
        }
      })
      .catch((error) => {
        console.error('Failed to load notification count:', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => void handleOpen()}
        className="relative flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <Bell className="size-4" />

        {unreadCount > 0 && (
          <span
            aria-label={`${unreadCount} unread notifications`}
            className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-4 font-bold text-primary-foreground"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
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
              onClick={() => void handleMarkAllAsRead()}
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
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification);

                  const isUnread = notification.readAt === null;

                  return (
                    <Link
                      key={notification.id}
                      href={getNotificationHref(notification)}
                      onClick={() => void handleNotificationClick(notification)}
                      className={[
                        'flex gap-3 px-4 py-3 transition-colors hover:bg-surface-hover',
                        isUnread ? 'bg-surface-hover/40' : '',
                      ].join(' ')}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted-foreground">
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={[
                            'text-sm leading-5',
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
                          className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto size-5 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">No notifications yet</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  When something happens in your social activity, you&apos;ll
                  see it here.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-border/60 px-4 py-3">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
