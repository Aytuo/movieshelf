import {
  getPostReactionStats as getPostReactionStatsRepository,
  getPostReactionUsers as getPostReactionUsersRepository,
  togglePostReaction as togglePostReactionRepository,
} from '@/lib/repositories';
import { notifyPostLiked } from './notification-service';

export async function getPostReactionStats(postIds: string[], userId: string) {
  return getPostReactionStatsRepository(postIds, userId);
}

export async function getPostReactionUsers(postId: string) {
  return getPostReactionUsersRepository(postId, 50);
}

export async function togglePostReaction(postId: string, userId: string) {
  const result = await togglePostReactionRepository(postId, userId);

  if (result.action === 'added') {
    try {
      await notifyPostLiked({
        actorId: userId,
        postId,
      });
    } catch (error) {
      console.error('Failed to create post reaction notification:', error);
    }
  }

  return result;
}
