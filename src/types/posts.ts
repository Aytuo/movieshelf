import type { Media, MediaType } from '@/lib/media';

/* ========================================================================== */
/*                                  POSTS                                     */
/* ========================================================================== */

export type PostAuthor = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  rating: number | null;
};

export type PostReactionUser = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
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
  reactionCount: number;
  viewerHasReacted: boolean;
  commentCount: number;
  lastComment: PostLastComment | null;
};

export type PostLastComment = {
  postId: string;
  id: string;
  createdAt: Date;
  author: {
    userId: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

export type PostPage = {
  posts: Post[];
  nextCursor: string | null;
};

export type PostPaginationOptions = {
  limit?: number;
  cursor?: string | null;
};
