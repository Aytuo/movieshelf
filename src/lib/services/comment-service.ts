import {
  createComment as createCommentRepository,
  getCommentReplies as getCommentRepliesRepository,
  getMediaAuthorRatings,
  getPostComments as getPostCommentsRepository,
  getPostMediaId,
} from '@/lib/repositories';
import type { Comment, CommentInput } from '@/types';
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
  userId: string
): Promise<Comment[]> {
  const comments = await getPostCommentsRepository(postId);

  return enrichComments(comments, postId, userId);
}

export async function getCommentReplies(
  parentId: string,
  postId: string,
  userId: string
): Promise<Comment[]> {
  const replies = await getCommentRepliesRepository(parentId, postId);

  return enrichComments(replies, postId, userId);
}
