import { db } from '@/lib/db';
import { comment, profile } from '@/lib/db/schema';
import type { Comment } from '@/types';
import { and, asc, count, desc, eq, isNull } from 'drizzle-orm';

type DbComment = typeof comment.$inferSelect;
type DbProfile = typeof profile.$inferSelect;

type CommentRow = {
  comment: DbComment;
  profile: DbProfile;
};

function mapComment(row: CommentRow, replyCount = 0): Comment {
  return {
    id: row.comment.id,
    content: row.comment.content,
    createdAt: row.comment.createdAt,
    updatedAt: row.comment.updatedAt,

    author: {
      userId: row.profile.userId,
      username: row.profile.username,
      displayName: row.profile.displayName,
      avatarUrl: row.profile.avatarUrl,
      rating: null,
    },

    postId: row.comment.postId,
    parentId: row.comment.parentId,

    replyCount,
    replies: undefined,

    reactionCount: 0,
    viewerHasReacted: false,
  };
}

export async function createComment(data: {
  authorId: string;
  postId: string;
  content: string;
  parentId: string | null;
}): Promise<Comment | null> {
  if (data.parentId) {
    const [parent] = await db
      .select({
        id: comment.id,
        postId: comment.postId,
        parentId: comment.parentId,
      })
      .from(comment)
      .where(eq(comment.id, data.parentId))
      .limit(1);

    if (!parent || parent.postId !== data.postId || parent.parentId !== null) {
      return null;
    }
  }

  const [created] = await db
    .insert(comment)
    .values({
      authorId: data.authorId,
      postId: data.postId,
      content: data.content,
      parentId: data.parentId,
    })
    .returning();

  if (!created) {
    return null;
  }

  const [row] = await db
    .select({
      comment,
      profile,
    })
    .from(comment)
    .innerJoin(profile, eq(profile.userId, comment.authorId))
    .where(eq(comment.id, created.id))
    .limit(1);

  return row ? mapComment(row) : null;
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const rows = await db
    .select({
      comment,
      profile,
    })
    .from(comment)
    .innerJoin(profile, eq(profile.userId, comment.authorId))
    .where(and(eq(comment.postId, postId), isNull(comment.parentId)))
    .orderBy(desc(comment.createdAt), desc(comment.id));

  if (rows.length === 0) {
    return [];
  }

  const replyCounts = await db
    .select({
      parentId: comment.parentId,
      count: count(),
    })
    .from(comment)
    .where(eq(comment.postId, postId))
    .groupBy(comment.parentId);

  const replyCountMap = new Map(
    replyCounts
      .filter(({ parentId }) => parentId !== null)
      .map(({ parentId, count: replyCount }) => [
        parentId as string,
        Number(replyCount),
      ])
  );

  return rows.map((row) =>
    mapComment(row, replyCountMap.get(row.comment.id) ?? 0)
  );
}

export async function getCommentReplies(
  parentId: string,
  postId: string
): Promise<Comment[]> {
  const rows = await db
    .select({
      comment,
      profile,
    })
    .from(comment)
    .innerJoin(profile, eq(profile.userId, comment.authorId))
    .where(and(eq(comment.parentId, parentId), eq(comment.postId, postId)))
    .orderBy(asc(comment.createdAt), asc(comment.id));

  return rows.map((row) => mapComment(row));
}
