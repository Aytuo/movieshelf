'use server';

import { requireSession } from '@/lib/auth/require-session';
import { completeOnboarding } from '@/lib/repositories/profile-repository';
import { ensureMovieExists } from '@/lib/services/movie-service';
import { setRating } from '@/lib/services/user-movie-service';
import { revalidatePath } from 'next/cache';

import {
  onboardingRatingsSchema,
  type OnboardingRatingsInput,
} from '@/lib/validations/onboarding';

export async function completeTasteOnboarding(input: OnboardingRatingsInput) {
  const session = await requireSession();

  const parsed = onboardingRatingsSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid onboarding data.');
  }

  for (const item of parsed.data.ratings) {
    const movie = await ensureMovieExists(item.movieId);

    await setRating(session.user.id, movie.id, item.rating);
  }

  await completeOnboarding(session.user.id);

  revalidatePath('/home');
  revalidatePath('/discover');
  revalidatePath('/shelf');

  return {
    success: true,
  };
}

export async function skipTasteOnboarding() {
  const session = await requireSession();

  await completeOnboarding(session.user.id);

  revalidatePath('/home');

  return {
    success: true,
  };
}
