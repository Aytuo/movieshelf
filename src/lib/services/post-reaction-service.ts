import {
  getPostReactionStats as getPostReactionStatsRepository,
  togglePostReaction as togglePostReactionRepository,
} from '@/lib/repositories';

export async function getPostReactionStats(postIds: string[], userId: string) {
  return getPostReactionStatsRepository(postIds, userId);
}

export async function togglePostReaction(postId: string, userId: string) {
  return togglePostReactionRepository(postId, userId);
}
