import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function createBaseUsername(name: string | null | undefined, email: string) {
  const fromName = name
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 14);

  if (fromName) {
    return fromName;
  }

  const fromEmail = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 14);

  return fromEmail || 'moviefan';
}

async function generateUniqueUsername(base: string) {
  let username = base;

  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await db
      .select({
        userId: profile.userId,
      })
      .from(profile)
      .where(eq(profile.username, username))
      .limit(1);

    if (!existing[0]) {
      return username;
    }

    const suffix = Math.floor(1000 + Math.random() * 9000);

    username = `${base.slice(0, 14 - 5)}_${suffix}`;
  }

  throw new Error('Unable to generate a unique username.');
}

export async function ensureProfile({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string | null | undefined;
  email: string;
}) {
  const existing = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, userId))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const baseUsername = createBaseUsername(name, email);

  const username = await generateUniqueUsername(baseUsername);

  const [created] = await db
    .insert(profile)
    .values({
      userId,
      username,
      displayName: name ?? null,
    })
    .returning();

  return created;
}
