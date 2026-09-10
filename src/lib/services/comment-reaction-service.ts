import {
  getCommentReactionStats as getCommentReactionStatsRepository,
  toggleCommentReaction as toggleCommentReactionRepository,
} from '@/lib/repositories';

export async function getCommentReactionStats(
  commentIds: string[],
  userId: string
) {
  return getCommentReactionStatsRepository(commentIds, userId);
}

export async function toggleCommentReaction(commentId: string, userId: string) {
  return toggleCommentReactionRepository(commentId, userId);
}
