import type { CommentInput } from '@/types';
import { z } from 'zod';

export const commentSchema = z.object({
  postId: z.string().uuid(),
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty.')
    .max(2000, 'Comment cannot exceed 2000 characters.'),
  parentId: z.string().uuid().nullable().optional(),
}) satisfies z.ZodType<CommentInput>;

export const editCommentSchema = commentSchema
  .pick({
    content: true,
  })
  .extend({
    commentId: z.string().uuid(),
  });

export const deleteCommentSchema = z.object({
  commentId: z.string().uuid(),
});
