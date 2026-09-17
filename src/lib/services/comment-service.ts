import {
  createComment as createCommentRepository,
  deleteComment as deleteCommentRepository,
  getCommentReplies as getCommentRepliesRepository,
  getMediaAuthorRatings,
  getPostComments as getPostCommentsRepository,
  getPostMediaId,
  updateComment as updateCommentRepository,
} from '@/lib/repositories';
import type { Comment, CommentInput, CommentPage } from '@/types';
import { getCommentReactionStats } from './comment-reaction-service';

async function enrichComments(
  comments: Comment[],
  postId: string,
  userId: string
): Promise<Comment[]> {
  if (comments.length === 0) {
    return [];
  }

  const authorIds = [
    ...new Set(comments.map((current) => current.author.userId)),
  ];

  const [reactionStats, mediaId] = await Promise.all([
    getCommentReactionStats(
      comments.map((current) => current.id),
      userId
    ),
    getPostMediaId(postId),
  ]);

  const authorRatings = mediaId
    ? await getMediaAuthorRatings(mediaId, authorIds)
    : [];

  const reactionStatsMap = new Map(
    reactionStats.map((stats) => [stats.commentId, stats])
  );

  const authorRatingsMap = new Map(
    authorRatings.map((rating) => [rating.userId, rating.rating])
  );

  return comments.map((current) => {
    const stats = reactionStatsMap.get(current.id);

    return {
      ...current,

      author: {
        ...current.author,
        rating: authorRatingsMap.get(current.author.userId) ?? null,
      },

      reactionCount: stats?.count ?? 0,
      viewerHasReacted: stats?.reacted ?? false,
    };
  });
}

export async function createComment(userId: string, input: CommentInput) {
  return createCommentRepository({
    authorId: userId,
    postId: input.postId,
    content: input.content,
    parentId: input.parentId ?? null,
  });
}

export async function getPostComments(
  postId: string,
  userId: string,
  cursor?: string,
  limit = 10
): Promise<CommentPage> {
  const page = await getPostCommentsRepository(postId, cursor, limit);

  const enrichedComments = await enrichComments(page.comments, postId, userId);

  return {
    ...page,
    comments: enrichedComments,
  };
}

export async function getCommentReplies(
  parentId: string,
  postId: string,
  userId: string
): Promise<Comment[]> {
  const replies = await getCommentRepliesRepository(parentId, postId);

  return enrichComments(replies, postId, userId);
}

export async function updateComment(
  userId: string,
  commentId: string,
  content: string
): Promise<{
  content: string;
  updatedAt: Date;
} | null> {
  return updateCommentRepository(commentId, userId, content);
}

export async function deleteComment(userId: string, commentId: string) {
  return deleteCommentRepository(commentId, userId);
}
