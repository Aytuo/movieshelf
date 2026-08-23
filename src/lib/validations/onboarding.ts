import { z } from 'zod';

export const onboardingSelectionSchema = z.object({
  movieIds: z
    .array(z.number().int().positive())
    .min(5, 'Please choose at least 5 movies.')
    .max(10, 'Please choose no more than 10 movies.'),
});

export type OnboardingSelectionInput = z.infer<
  typeof onboardingSelectionSchema
>;

export const onboardingRatingsSchema = z.object({
  ratings: z
    .array(
      z.object({
        movieId: z.number().int().positive(),
        rating: z.number().min(1).max(10),
      })
    )
    .min(5)
    .max(10),
});

export type OnboardingRatingsInput = z.infer<typeof onboardingRatingsSchema>;
