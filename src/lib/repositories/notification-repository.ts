import { db } from '@/lib/db';
import { notification } from '@/lib/db/schema';
import type { NotificationType } from '@/types';

export type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string | null;
  commentId?: string | null;
};

export async function createNotification(data: CreateNotificationInput) {
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
