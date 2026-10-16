import { db } from '@/lib/db';
import { account } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

export async function getLinkedAccountProviderIds(userId: string) {
  const linkedAccounts = await db
    .select({
      providerId: account.providerId,
    })
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        inArray(account.providerId, ['credential', 'google', 'discord'])
      )
    );

  return linkedAccounts.map(({ providerId }) => providerId);
}
