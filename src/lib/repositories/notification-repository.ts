import { db } from '@/lib/db';
import { notification, profile } from '@/lib/db/schema';
import type { Notification, NotificationPage, NotificationType } from '@/types';
import { and, desc, eq, isNull, lt, or } from 'drizzle-orm';

const DEFAULT_NOTIFICATION_PAGE_SIZE = 20;
const MAX_NOTIFICATION_PAGE_SIZE = 50;

type NotificationCursor = {
  createdAt: string;
  id: string;
};

function encodeCursor(cursor: NotificationCursor) {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

function decodeCursor(cursor: string): NotificationCursor | null {
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8');

    const parsed = JSON.parse(decoded) as Partial<NotificationCursor>;

    if (typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') {
      return null;
    }

    const date = new Date(parsed.createdAt);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return {
      createdAt: date.toISOString(),
      id: parsed.id,
    };
  } catch {
    return null;
  }
}

function mapNotification(row: {
  notification: typeof notification.$inferSelect;
  profile: typeof profile.$inferSelect;
}): Notification {
  return {
    id: row.notification.id,

    recipientId: row.notification.recipientId,

    actorId: row.notification.actorId,

    type: row.notification.type as NotificationType,

    postId: row.notification.postId,

    commentId: row.notification.commentId,

    readAt: row.notification.readAt,

    createdAt: row.notification.createdAt,

    actor: {
      userId: row.profile.userId,
      username: row.profile.username,
      displayName: row.profile.displayName,
      avatarUrl: row.profile.avatarUrl,
    },
  };
}

export async function createNotification(data: {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string | null;
  commentId?: string | null;
}) {
  const [created] = await db
    .insert(notification)
    .values({
      recipientId: data.recipientId,
      actorId: data.actorId,
      type: data.type,
      postId: data.postId ?? null,
      commentId: data.commentId ?? null,
    })
    .returning();

  return created ?? null;
}

export async function getNotifications(
  recipientId: string,
  options: {
    cursor?: string;
    limit?: number;
  } = {}
): Promise<NotificationPage> {
  const limit = Math.min(
    Math.max(options.limit ?? DEFAULT_NOTIFICATION_PAGE_SIZE, 1),
    MAX_NOTIFICATION_PAGE_SIZE
  );

  const cursor = options.cursor ? decodeCursor(options.cursor) : null;

  if (options.cursor && !cursor) {
    throw new Error('Invalid notification cursor.');
  }

  const rows = await db
    .select({
      notification,
      profile,
    })
    .from(notification)
    .innerJoin(profile, eq(profile.userId, notification.actorId))
    .where(
      cursor
        ? and(
            eq(notification.recipientId, recipientId),
            or(
              lt(notification.createdAt, new Date(cursor.createdAt)),
              and(
                eq(notification.createdAt, new Date(cursor.createdAt)),
                lt(notification.id, cursor.id)
              )
            )
          )
        : eq(notification.recipientId, recipientId)
    )
    .orderBy(desc(notification.createdAt), desc(notification.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;

  const visibleRows = hasMore ? rows.slice(0, limit) : rows;

  const lastRow = visibleRows.at(-1);

  const nextCursor =
    hasMore && lastRow
      ? encodeCursor({
          createdAt: lastRow.notification.createdAt.toISOString(),
          id: lastRow.notification.id,
        })
      : null;

  return {
    notifications: visibleRows.map(mapNotification),
    nextCursor,
    hasMore,
  };
}

export async function getUnreadNotificationCount(
  recipientId: string
): Promise<number> {
  const count = await db.$count(
    notification,
    and(eq(notification.recipientId, recipientId), isNull(notification.readAt))
  );

  return Number(count);
}

export async function markNotificationAsRead(
  notificationId: string,
  recipientId: string
): Promise<boolean> {
  const [updated] = await db
    .update(notification)
    .set({
      readAt: new Date(),
    })
    .where(
      and(
        eq(notification.id, notificationId),
        eq(notification.recipientId, recipientId),
        isNull(notification.readAt)
      )
    )
    .returning({
      id: notification.id,
    });

  return Boolean(updated);
}

export async function markAllNotificationsAsRead(
  recipientId: string
): Promise<number> {
  const updated = await db
    .update(notification)
    .set({
      readAt: new Date(),
    })
    .where(
      and(
        eq(notification.recipientId, recipientId),
        isNull(notification.readAt)
      )
    )
    .returning({
      id: notification.id,
    });

  return updated.length;
}
