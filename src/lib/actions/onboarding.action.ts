'use server';

import { requireSession } from '@/lib/auth/require-session';
import { completeOnboarding } from '@/lib/repositories/profile-repository';
import { setRating } from '@/lib/services/media-interaction-service';
import { getOrCreateMediaRecord } from '@/lib/services/media-service';
import {
  onboardingRatingsSchema,
  type OnboardingRatingsInput,
} from '@/lib/validations/onboarding';
import { revalidatePath } from 'next/cache';

export async function saveTasteRatings(input: OnboardingRatingsInput) {
  const session = await requireSession();

  const parsed = onboardingRatingsSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error('Invalid onboarding data.');
  }

  for (const item of parsed.data.ratings) {
    const media = await getOrCreateMediaRecord(item.type, item.tmdbId);

    await setRating(session.user.id, media.id, item.rating);
  }

  revalidatePath('/home');
  revalidatePath('/discover');
  revalidatePath('/shelf');
}

export async function finishTasteOnboarding() {
  const session = await requireSession();

  await completeOnboarding(session.user.id);

  revalidatePath('/home');
  revalidatePath('/discover');
  revalidatePath('/shelf');

  return {
    success: true,
  };
}

export async function skipTasteOnboarding() {
  await requireSession();

  // Skipping onboarding does not mark it as completed- the user can return to onboarding later.

  return {
    success: true,
  };
}
