import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getProfileByUserId(userId: string) {
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function completeOnboarding(userId: string) {
  const [updated] = await db
    .update(profile)
    .set({
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(profile.userId, userId))
    .returning();

  return updated;
}
