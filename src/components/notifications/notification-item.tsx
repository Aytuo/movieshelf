import {
  formatNotificationDate,
  getNotificationMessage,
  notificationIconMap,
} from '@/lib/notifications/notification-utils';
import type { Notification } from '@/types';

type NotificationItemProps = {
  notification: Notification;
  onClick: (notification: Notification) => void;
};

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const Icon = notificationIconMap[notification.type];
  const isUnread = notification.readAt === null;

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={[
        'flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-hover',
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
            isUnread ? 'font-medium text-foreground' : 'text-muted-foreground',
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
    </button>
  );
}
