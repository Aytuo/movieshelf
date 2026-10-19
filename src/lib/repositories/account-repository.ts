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

export type OAuthProviderId = 'google' | 'discord';

export async function getLinkedOAuthAccounts(userId: string) {
  const linkedAccounts = await db
    .select({
      id: account.id,
      providerId: account.providerId,
    })
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        inArray(account.providerId, ['google', 'discord'])
      )
    );

  return linkedAccounts.filter(
    (
      linkedAccount
    ): linkedAccount is {
      id: string;
      providerId: OAuthProviderId;
    } =>
      linkedAccount.providerId === 'google' ||
      linkedAccount.providerId === 'discord'
  );
}

export async function getLinkedOAuthAccountByProvider(
  userId: string,
  provider: OAuthProviderId
) {
  const [linkedAccount] = await db
    .select({
      id: account.id,
    })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, provider)))
    .limit(1);

  return linkedAccount ?? null;
}
