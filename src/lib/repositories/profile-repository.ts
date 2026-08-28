import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema/tables';
import { and, eq, ne } from 'drizzle-orm';

export async function getProfileByUserId(userId: string) {
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function getProfileByUsername(username: string) {
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.username, username))
    .limit(1);

  return result[0] ?? null;
}

export async function isUsernameAvailable(
  username: string,
  currentUserId: string
) {
  const result = await db
    .select({
      userId: profile.userId,
    })
    .from(profile)
    .where(
      and(eq(profile.username, username), ne(profile.userId, currentUserId))
    )
    .limit(1);

  return !result[0];
}

export async function updateProfile(
  userId: string,
  data: {
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
  }
) {
  const [updated] = await db
    .update(profile)
    .set({
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
      updatedAt: new Date(),
    })
    .where(eq(profile.userId, userId))
    .returning();

  return updated;
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
