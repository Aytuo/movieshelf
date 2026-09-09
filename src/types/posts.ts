import type { Media, MediaType } from '@/lib/media';

/* ========================================================================== */
/*                                  POSTS                                     */
/* ========================================================================== */

export type PostAuthor = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type PostInput = {
  type: MediaType;
  tmdbId: number;
  title: string;
  content: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthor;
  media: Media;
};

export type PostPage = {
  posts: Post[];
  nextCursor: string | null;
};

export type PostPaginationOptions = {
  limit?: number;
  cursor?: string | null;
};
