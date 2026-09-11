import {
  createPost as createPostRepository,
  getMediaPosts as getMediaPostsRepository,
  getPostById as getPostByIdRepository,
  getPostCommentCounts,
} from '@/lib/repositories';
import type { Post, PostInput, PostPaginationOptions } from '@/types';
import { getPostReactionStats } from './post-reaction-service';

function attachPostStats(
  posts: Post[],
  reactionStats: Awaited<ReturnType<typeof getPostReactionStats>>,
  commentCounts: Awaited<ReturnType<typeof getPostCommentCounts>>
): Post[] {
  const reactions = new Map(reactionStats.map((item) => [item.postId, item]));

  const comments = new Map(
    commentCounts.map((item) => [item.postId, item.count])
  );

  return posts.map((post) => {
    const reaction = reactions.get(post.id);

    return {
      ...post,
      reactionCount: reaction?.count ?? 0,
      viewerHasReacted: reaction?.reacted ?? false,
      commentCount: comments.get(post.id) ?? 0,
    };
  });
}

export async function createPost(
  userId: string,
  mediaId: string,
  input: PostInput
) {
  return createPostRepository({
    authorId: userId,
    mediaId,
    title: input.title,
    content: input.content,
  });
}

export async function getMediaPosts(
  mediaId: string,
  userId: string,
  options?: PostPaginationOptions
) {
  const page = await getMediaPostsRepository(mediaId, options);

  if (page.posts.length === 0) {
    return page;
  }

  const postIds = page.posts.map((post) => post.id);

  const [reactionStats, commentCounts] = await Promise.all([
    getPostReactionStats(postIds, userId),
    getPostCommentCounts(postIds),
  ]);

  return {
    ...page,
    posts: attachPostStats(page.posts, reactionStats, commentCounts),
  };
}

export async function getPostById(postId: string) {
  return getPostByIdRepository(postId);
}

export async function getPostByIdWithReaction(postId: string, userId: string) {
  const post = await getPostByIdRepository(postId);

  if (!post) {
    return null;
  }

  const [reaction] = await getPostReactionStats([post.id], userId);

  const [commentCount] = await getPostCommentCounts([post.id]);

  return {
    ...post,
    reactionCount: reaction?.count ?? 0,
    viewerHasReacted: reaction?.reacted ?? false,
    commentCount: commentCount?.count ?? 0,
  };
}
