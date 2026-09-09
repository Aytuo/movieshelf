import {
  createPost as createPostRepository,
  getMediaPosts as getMediaPostsRepository,
  getPostById as getPostByIdRepository,
} from '@/lib/repositories';
import type { PostInput, PostPaginationOptions } from '@/types';
import { getOrCreateMediaRecord } from './media-service';

export async function createPost(userId: string, input: PostInput) {
  const media = await getOrCreateMediaRecord(input.type, input.tmdbId);

  return createPostRepository({
    authorId: userId,
    mediaId: media.id,
    title: input.title,
    content: input.content,
  });
}

export async function getMediaPosts(
  type: PostInput['type'],
  tmdbId: number,
  options?: PostPaginationOptions
) {
  const media = await getOrCreateMediaRecord(type, tmdbId);

  return getMediaPostsRepository(media.id, options);
}

export async function getPostById(postId: string) {
  return getPostByIdRepository(postId);
}
