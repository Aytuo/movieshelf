import {
  createComment as createCommentRepository,
  getMediaAuthorRatings,
  getPostComments as getPostCommentsRepository,
  getPostMediaId,
} from '@/lib/repositories';
import type { Comment, CommentInput } from '@/types';
import { getCommentReactionStats } from './comment-reaction-service';

function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();

  for (const current of comments) {
    commentMap.set(current.id, {
      ...current,
      replies: [],
    });
  }

  const roots: Comment[] = [];

  for (const current of commentMap.values()) {
    if (!current.parentId) {
      roots.push(current);
      continue;
    }

    const parent = commentMap.get(current.parentId);

    if (parent) {
      parent.replies.push(current);
    }
  }

  return roots;
}

function flattenComments(comments: Comment[]): Comment[] {
  return comments.flatMap((comment) => [
    comment,
    ...flattenComments(comment.replies),
  ]);
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

  const tree = buildCommentTree(comments);
  const flatComments = flattenComments(tree);

  if (flatComments.length === 0) {
    return tree;
  }

  const authorIds = [
    ...new Set(flatComments.map((comment) => comment.author.userId)),
  ];

  const [reactionStats, mediaId] = await Promise.all([
    getCommentReactionStats(
      flatComments.map((comment) => comment.id),
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

  function attachReactionStats(comments: Comment[]): Comment[] {
    return comments.map((comment) => {
      const stats = reactionStatsMap.get(comment.id);

      return {
        ...comment,
        author: {
          ...comment.author,
          rating: authorRatingsMap.get(comment.author.userId) ?? null,
        },
        reactionCount: stats?.count ?? 0,
        viewerHasReacted: stats?.reacted ?? false,
        replies: attachReactionStats(comment.replies),
      };
    });
  }

  return attachReactionStats(tree);
}
