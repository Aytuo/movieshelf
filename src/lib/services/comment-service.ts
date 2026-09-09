import {
  createComment as createCommentRepository,
  getPostComments as getPostCommentsRepository,
} from '@/lib/repositories';
import type { Comment, CommentInput } from '@/types';

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

export async function createComment(userId: string, input: CommentInput) {
  return createCommentRepository({
    authorId: userId,
    postId: input.postId,
    content: input.content,
    parentId: input.parentId ?? null,
  });
}

export async function getPostComments(postId: string) {
  const comments = await getPostCommentsRepository(postId);

  return buildCommentTree(comments);
}
