import type { MediaType } from '@/lib/media';
import { z } from 'zod';

const mediaTypeSchema = z.enum(['movie', 'tv']) satisfies z.ZodType<MediaType>;

export const onboardingSelectionSchema = z.object({
  media: z
    .array(
      z.object({
        tmdbId: z.number().int().positive(),
        type: mediaTypeSchema,
      })
    )
    .min(5, 'Please choose at least 5 titles.')
    .max(10, 'Please choose no more than 10 titles.'),
});

export type OnboardingSelectionInput = z.infer<
  typeof onboardingSelectionSchema
>;

export const onboardingRatingsSchema = z.object({
  ratings: z
    .array(
      z.object({
        tmdbId: z.number().int().positive(),
        type: z.enum(['movie', 'tv']),
        rating: z.number().min(1).max(10),
      })
    )
    .min(5, 'Please rate at least 5 titles.')
    .max(10, 'Please rate no more than 10 titles.'),
});

export type OnboardingRatingsInput = z.infer<typeof onboardingRatingsSchema>;
