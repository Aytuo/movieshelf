/* ========================================================================== */
/*                                COMMENTS                                    */
/* ========================================================================== */

type CommentAuthor = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  rating: number | null;
};

export type CommentInput = {
  postId: string;
  content: string;
  parentId?: string | null;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  author: CommentAuthor | null;

  postId: string;
  parentId: string | null;

  hasReplies: boolean;
  replyCount: number;
  replies?: Comment[];

  reactionCount: number;
  viewerHasReacted: boolean;
};

export type CommentPage = {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount: number;
};
