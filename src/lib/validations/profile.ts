import { z } from 'zod';

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Username must contain at least 3 characters.')
  .max(20, 'Username cannot exceed 20 characters.')
  .regex(
    /^[a-z0-9_]+$/,
    'Username can only contain letters, numbers and underscores.'
  );

export const profileUpdateSchema = z.object({
  username: usernameSchema,
  displayName: z
    .string()
    .trim()
    .max(50, 'Display name cannot exceed 50 characters.')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .trim()
    .max(280, 'Bio cannot exceed 280 characters.')
    .optional()
    .or(z.literal('')),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
