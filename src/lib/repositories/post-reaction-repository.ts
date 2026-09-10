import { db } from '@/lib/db';
import { postReaction } from '@/lib/db/schema';
import { and, eq, inArray, sql } from 'drizzle-orm';

export type PostReactionStats = {
  postId: string;
  count: number;
  reacted: boolean;
};

export type PostReactionToggleResult = {
  postId: string;
  count: number;
  reacted: boolean;
};

export async function getPostReactionStats(
  postIds: string[],
  userId: string
): Promise<PostReactionStats[]> {
  if (postIds.length === 0) {
    return [];
  }

  const rows = await db
    .select({
      postId: postReaction.postId,
      count: sql<number>`count(*)::int`,
      reacted: sql<boolean>`
        bool_or(${postReaction.userId} = ${userId})
      `,
    })
    .from(postReaction)
    .where(
      and(inArray(postReaction.postId, postIds), eq(postReaction.type, 'like'))
    )
    .groupBy(postReaction.postId);

  return rows.map((row) => ({
    postId: row.postId,
    count: row.count,
    reacted: row.reacted,
  }));
}

export async function togglePostReaction(
  postId: string,
  userId: string
): Promise<PostReactionToggleResult> {
  const deleted = await db
    .delete(postReaction)
    .where(
      and(
        eq(postReaction.postId, postId),
        eq(postReaction.userId, userId),
        eq(postReaction.type, 'like')
      )
    )
    .returning({
      id: postReaction.id,
    });

  if (deleted.length === 0) {
    await db
      .insert(postReaction)
      .values({
        postId,
        userId,
        type: 'like',
      })
      .onConflictDoNothing({
        target: [postReaction.userId, postReaction.postId, postReaction.type],
      });
  }

  const [stats] = await db
    .select({
      count: sql<number>`count(*)::int`,
      reacted: sql<boolean>`
        bool_or(${postReaction.userId} = ${userId})
      `,
    })
    .from(postReaction)
    .where(and(eq(postReaction.postId, postId), eq(postReaction.type, 'like')));

  return {
    postId,
    count: stats?.count ?? 0,
    reacted: stats?.reacted ?? false,
  };
}
