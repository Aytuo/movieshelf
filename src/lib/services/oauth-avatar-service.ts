import 'server-only';

import { auth } from '@/lib/auth';
import {
  getLinkedOAuthAccountByProvider,
  getLinkedOAuthAccounts,
  type OAuthProviderId,
} from '@/lib/repositories';
import { headers } from 'next/headers';

type AccountInfoData = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  data?: Record<string, unknown>;
};

export type OAuthAvatarAccountOption = {
  provider: OAuthProviderId;
  label: string;
  displayName: string | null;
  identifier: string | null;
  image: string | null;
};

function getProviderImage(info: AccountInfoData): string | null {
  const raw = info.data ?? {};

  return (
    info.user?.image ?? (typeof raw.picture === 'string' ? raw.picture : null)
  );
}

function mapOAuthAvatarAccount(
  provider: OAuthProviderId,
  info: AccountInfoData
): OAuthAvatarAccountOption {
  const raw = info.data ?? {};

  return {
    provider,
    label: provider === 'google' ? 'Google' : 'Discord',
    displayName: info.user?.name ?? null,
    identifier:
      provider === 'discord'
        ? typeof raw.username === 'string'
          ? `@${raw.username}`
          : (info.user?.email ?? null)
        : (info.user?.email ?? null),
    image: getProviderImage(info),
  };
}

export async function getOAuthAvatarAccounts(
  userId: string
): Promise<OAuthAvatarAccountOption[]> {
  const linkedAccounts = await getLinkedOAuthAccounts(userId);

  if (linkedAccounts.length === 0) {
    return [];
  }

  const requestHeaders = await headers();

  return Promise.all(
    linkedAccounts.map(async (linkedAccount) => {
      const info = await auth.api.accountInfo({
        query: {
          accountId: linkedAccount.id,
        },
        headers: requestHeaders,
      });

      return mapOAuthAvatarAccount(
        linkedAccount.providerId,
        info as AccountInfoData
      );
    })
  );
}

export async function getOAuthAvatarForProvider(
  userId: string,
  provider: OAuthProviderId
): Promise<{ image: string | null } | null> {
  const linkedAccount = await getLinkedOAuthAccountByProvider(userId, provider);

  if (!linkedAccount) {
    return null;
  }

  const info = await auth.api.accountInfo({
    query: {
      accountId: linkedAccount.id,
    },
    headers: await headers(),
  });

  return {
    image: getProviderImage(info as AccountInfoData),
  };
}
