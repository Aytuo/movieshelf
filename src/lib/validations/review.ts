import { z } from 'zod';

export const reviewSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, 'Title cannot exceed 100 characters.')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .trim()
    .min(20, 'Review must contain at least 20 characters.')
    .max(5000, 'Review cannot exceed 5000 characters.'),
  rating: z.number().min(1).max(10),
  containsSpoilers: z.boolean(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
