import type { PostInput } from '@/types';
import { z } from 'zod';

export const postSchema: z.ZodType<PostInput, PostInput> = z.object({
  type: z.enum(['movie', 'tv']),
  tmdbId: z.number().int().positive(),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title cannot exceed 120 characters.'),
  content: z
    .string()
    .trim()
    .min(1, 'Post cannot be empty.')
    .max(5000, 'Post cannot exceed 5000 characters.'),
});
