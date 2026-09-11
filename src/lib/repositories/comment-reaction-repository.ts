import { db } from '@/lib/db';
import { commentReaction } from '@/lib/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

export type CommentReactionStats = {
  commentId: string;
  count: number;
  reacted: boolean;
};

export type CommentReactionToggleResult = {
  commentId: string;
  count: number;
  reacted: boolean;
};

export async function getCommentReactionStats(
  commentIds: string[],
  userId: string
): Promise<CommentReactionStats[]> {
  if (commentIds.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      commentId: commentReaction.commentId,
      count: sql<number>`count(*)::int`,
      reacted: sql<boolean>`
        bool_or(${commentReaction.userId} = ${userId})
      `,
    })
    .from(commentReaction)
    .where(
      and(
        inArray(commentReaction.commentId, commentIds),
        eq(commentReaction.type, 'like')
      )
    )
    .groupBy(commentReaction.commentId);

  return rows.map((row) => ({
    commentId: row.commentId,
    count: row.count,
    reacted: row.reacted,
  }));
}

export async function toggleCommentReaction(
  commentId: string,
  userId: string
): Promise<CommentReactionToggleResult> {
  const deleted = await db
    .delete(commentReaction)
    .where(
      and(
        eq(commentReaction.commentId, commentId),
        eq(commentReaction.userId, userId),
        eq(commentReaction.type, 'like')
      )
    )
    .returning({
      id: commentReaction.id,
    });

  if (deleted.length === 0) {
    await db
      .insert(commentReaction)
      .values({
        commentId,
        userId,
        type: 'like',
      })
      .onConflictDoNothing({
        target: [
          commentReaction.userId,
          commentReaction.commentId,
          commentReaction.type,
        ],
      });
  }

  const [stats] = await db
    .select({
      count: sql<number>`count(*)::int`,
      reacted: sql<boolean>`
        bool_or(${commentReaction.userId} = ${userId})
      `,
    })
    .from(commentReaction)
    .where(
      and(
        eq(commentReaction.commentId, commentId),
        eq(commentReaction.type, 'like')
      )
    );

  return {
    commentId,
    count: stats?.count ?? 0,
    reacted: stats?.reacted ?? false,
  };
}
