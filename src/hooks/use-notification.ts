import {
  loadNotifications,
  loadUnreadNotificationCount,
  markAllNotificationsAsReadAction,
  markNotificationAsReadAction,
} from '@/lib/actions/notification-action';
import { getNotificationHref } from '@/lib/notifications/notification-utils';
import type { Notification } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function useNotification() {
  const router = useRouter();

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
      return count;
    } catch (error) {
      console.error('Failed to load notification count:', error);
      throw error;
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
    try {
      if (!notification.readAt) {
        const success = await markNotificationAsReadAction(notification.id);

        if (success) {
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
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    } finally {
      setIsOpen(false);
      router.push(getNotificationHref(notification));
    }
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

  return {
    containerRef,
    isOpen,
    notifications,
    unreadCount,
    isLoading,
    isMarkingAllRead,
    handleOpen,
    handleNotificationClick,
    handleMarkAllAsRead,
    close: () => setIsOpen(false),
  };
}
