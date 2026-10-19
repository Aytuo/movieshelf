import { getLinkedAccountProviderIds } from '@/lib/repositories';

export type SessionReauthenticationProvider = 'google' | 'discord';

export async function getSessionReauthenticationOptions(userId: string) {
  const providerIds = await getLinkedAccountProviderIds(userId);

  const oauthProviders = Array.from(
    new Set(
      providerIds.filter(
        (providerId): providerId is SessionReauthenticationProvider =>
          providerId === 'google' || providerId === 'discord'
      )
    )
  );

  return {
    hasPassword: providerIds.includes('credential'),
    oauthProviders,
  };
}
