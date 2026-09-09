import { db } from '@/lib/db';
import { comment, profile } from '@/lib/db/schema';
import type { Comment } from '@/types';
import { asc, eq } from 'drizzle-orm';

type DbComment = typeof comment.$inferSelect;
type DbProfile = typeof profile.$inferSelect;

type CommentRow = {
  comment: DbComment;
  profile: DbProfile;
};

function mapComment(row: CommentRow): Comment {
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
    },
    postId: row.comment.postId,
    parentId: row.comment.parentId,
    replies: [],
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
      })
      .from(comment)
      .where(eq(comment.id, data.parentId))
      .limit(1);

    if (!parent || parent.postId !== data.postId) {
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

  return row ? mapComment(row as CommentRow) : null;
}

export async function getPostComments(postId: string): Promise<Comment[]> {
  const rows = await db
    .select({
      comment,
      profile,
    })
    .from(comment)
    .innerJoin(profile, eq(profile.userId, comment.authorId))
    .where(eq(comment.postId, postId))
    .orderBy(asc(comment.createdAt), asc(comment.id));

  return rows.map((row) => mapComment(row as CommentRow));
}
