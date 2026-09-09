/* ========================================================================== */
/*                                COMMENTS                                    */
/* ========================================================================== */

type CommentAuthor = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
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
  author: CommentAuthor;
  postId: string;
  parentId: string | null;
  replies: Comment[];
};
