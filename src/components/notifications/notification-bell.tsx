'use client';

import { useNotification } from '@/hooks/use-notification';
import { Bell } from 'lucide-react';
import { NotificationPopover } from './notification-popover';

const NotificationBell = () => {
  const {
    containerRef,
    isOpen,
    notifications,
    unreadCount,
    isLoading,
    isMarkingAllRead,
    handleOpen,
    handleNotificationClick,
    handleMarkAllAsRead,
    close,
  } = useNotification();

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
        <NotificationPopover
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          isMarkingAllRead={isMarkingAllRead}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={() => void handleMarkAllAsRead()}
          onClose={close}
        />
      )}
    </div>
  );
};

export default NotificationBell;
