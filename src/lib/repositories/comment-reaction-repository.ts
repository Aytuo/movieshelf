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
  const result = await db.execute<{
    count: number;
    reacted: boolean;
  }>(sql`
    WITH deleted AS (
      DELETE FROM comment_reaction
      WHERE
        comment_id = ${commentId}
        AND user_id = ${userId}
        AND type = 'like'
      RETURNING id
    ),
    inserted AS (
      INSERT INTO comment_reaction (
        user_id,
        comment_id,
        type
      )
      SELECT
        ${userId},
        ${commentId},
        'like'
      WHERE NOT EXISTS (
        SELECT 1 FROM deleted
      )
      ON CONFLICT (
        user_id,
        comment_id,
        type
      )
      DO NOTHING
      RETURNING id
    )
    SELECT
      (
        SELECT count(*)::int
        FROM comment_reaction
        WHERE
          comment_id = ${commentId}
          AND type = 'like'
      ) AS count,
      EXISTS (
        SELECT 1
        FROM comment_reaction
        WHERE
          comment_id = ${commentId}
          AND user_id = ${userId}
          AND type = 'like'
      ) AS reacted
  `);

  const row = result.rows[0];

  return {
    commentId,
    count: row?.count ?? 0,
    reacted: row?.reacted ?? false,
  };
}
