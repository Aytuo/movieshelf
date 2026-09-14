import { db } from '@/lib/db';
import { comment, profile } from '@/lib/db/schema';
import type { Comment } from '@/types';
import { and, asc, desc, eq, isNull, lt, or, sql } from 'drizzle-orm';

type DbComment = typeof comment.$inferSelect;
type DbProfile = typeof profile.$inferSelect;

type CommentRow = {
  comment: DbComment;
  profile: DbProfile;
};

type CommentCursor = {
  createdAt: string;
  id: string;
};

function encodeCursor(cursor: CommentCursor) {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

function decodeCursor(cursor: string): CommentCursor | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8')
    );

    if (typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

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

export async function getPostComments(
  postId: string,
  cursor?: string,
  limit = 10
): Promise<{
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
}> {
  const decodedCursor = cursor ? decodeCursor(cursor) : null;

  if (cursor && !decodedCursor) {
    throw new Error('Invalid comment cursor.');
  }

  const replyCountExpression = sql<number>`
  (
    select count(*)
    from ${comment} as reply
    where reply.parent_id = ${comment.id}
  )
`.mapWith(Number);

  const commentsQuery = db
    .select({
      comment,
      profile,
      replyCount: replyCountExpression,
    })
    .from(comment)
    .innerJoin(profile, eq(profile.userId, comment.authorId))
    .where(
      and(
        eq(comment.postId, postId),
        isNull(comment.parentId),
        decodedCursor
          ? or(
              lt(comment.createdAt, new Date(decodedCursor.createdAt)),
              and(
                eq(comment.createdAt, new Date(decodedCursor.createdAt)),
                lt(comment.id, decodedCursor.id)
              )
            )
          : undefined
      )
    )
    .orderBy(desc(comment.createdAt), desc(comment.id))
    .limit(limit + 1);

  const totalCountQuery = db.$count(comment, eq(comment.postId, postId));

  const [rows, totalCount] = await Promise.all([
    commentsQuery,
    totalCountQuery,
  ]);

  const hasMore = rows.length > limit;

  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  const lastRow = pageRows[pageRows.length - 1];

  const nextCursor =
    hasMore && lastRow
      ? encodeCursor({
          createdAt: lastRow.comment.createdAt.toISOString(),
          id: lastRow.comment.id,
        })
      : null;

  return {
    comments: pageRows.map((row) => mapComment(row, Number(row.replyCount))),
    nextCursor,
    hasMore,
    totalCount: Number(totalCount),
  };
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
