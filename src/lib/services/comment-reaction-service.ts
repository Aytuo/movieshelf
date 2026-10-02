import {
  getCommentReactionStats as getCommentReactionStatsRepository,
  getCommentReactionUsers as getCommentReactionUsersRepository,
  toggleCommentReaction as toggleCommentReactionRepository,
} from '@/lib/repositories';
import { notifyCommentLiked } from './notification-service';

export async function getCommentReactionStats(
  commentIds: string[],
  userId: string
) {
  return getCommentReactionStatsRepository(commentIds, userId);
}

export async function toggleCommentReaction(commentId: string, userId: string) {
  const result = await toggleCommentReactionRepository(commentId, userId);

  if (result.action === 'added') {
    try {
      await notifyCommentLiked({
        actorId: userId,
        commentId,
      });
    } catch (error) {
      console.error('Failed to create comment reaction notification:', error);
    }
  }

  return result;
}

export async function getCommentReactionUsers(commentId: string) {
  return getCommentReactionUsersRepository(commentId, 50);
}
