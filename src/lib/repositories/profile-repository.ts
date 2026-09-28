import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { profile } from '../db/schema';

type DbProfile = typeof profile.$inferSelect;
type DbProfileInsert = typeof profile.$inferInsert;
type DbProfileUpdate = {
  username: string;
  displayName: string | null;
  bio: string | null;
};

export async function getProfileByUserId(
  userId: string
): Promise<DbProfile | null> {
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function getProfileByUsername(
  username: string
): Promise<DbProfile | null> {
  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.username, username))
    .limit(1);

  return result[0] ?? null;
}

export async function usernameExists(username: string): Promise<boolean> {
  const result = await db
    .select({
      userId: profile.userId,
    })
    .from(profile)
    .where(eq(profile.username, username))
    .limit(1);

  return result.length > 0;
}

export async function createProfile(data: DbProfileInsert) {
  const [created] = await db.insert(profile).values(data).returning();

  return created;
}

export async function updateProfile(userId: string, data: DbProfileUpdate) {
  const [updated] = await db
    .update(profile)
    .set({
      username: data.username,
      displayName: data.displayName,
      bio: data.bio,
      updatedAt: new Date(),
    })
    .where(eq(profile.userId, userId))
    .returning();

  return updated;
}

import type {
  AvatarProvider,
  AvatarSource,
} from '@/lib/db/schema/tables/profile';

export async function updateProfileAvatar(
  userId: string,
  data: {
    avatarUrl: string | null;
    avatarSource: AvatarSource;
    avatarProvider: AvatarProvider | null;
  }
) {
  const [updated] = await db
    .update(profile)
    .set({
      avatarUrl: data.avatarUrl,
      avatarSource: data.avatarSource,
      avatarProvider: data.avatarProvider,
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
