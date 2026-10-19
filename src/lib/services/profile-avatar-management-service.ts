import 'server-only';

import { getProfileByUserId, updateProfileAvatar } from '@/lib/repositories';
import { getOAuthAvatarForProvider } from '@/lib/services/oauth-avatar-service';
import {
  deleteStoredAvatar,
  getAvatarProviderFromUrl,
  storeAvatarFile,
  storeAvatarFromUrl,
} from '@/lib/services/profile-avatar-service';

export type ProfileAvatarProvider = 'google' | 'discord';

export async function setProfileAvatarSource(
  userId: string,
  source: 'default' | 'oauth',
  provider?: ProfileAvatarProvider
) {
  const profile = await getProfileByUserId(userId);

  if (!profile) {
    return {
      success: false as const,
      message: 'Profile not found.',
    };
  }

  if (source === 'default') {
    await updateProfileAvatar(userId, {
      avatarUrl: null,
      avatarSource: 'default',
      avatarProvider: null,
      avatarPreferenceSet: true,
    });

    await deleteStoredAvatar(profile.avatarUrl, profile.avatarSource);

    return {
      success: true as const,
      avatarUrl: null,
      username: profile.username,
    };
  }

  if (!provider) {
    return {
      success: false as const,
      message: 'Avatar provider is required.',
    };
  }

  const accountInfo = await getOAuthAvatarForProvider(userId, provider);

  if (!accountInfo) {
    return {
      success: false as const,
      message: 'This account is not connected.',
    };
  }

  if (!accountInfo.image) {
    return {
      success: false as const,
      message: 'This connected account does not provide an avatar.',
    };
  }

  const storedUrl = await storeAvatarFromUrl(userId, accountInfo.image);

  try {
    await updateProfileAvatar(userId, {
      avatarUrl: storedUrl,
      avatarSource: 'oauth',
      avatarProvider: provider,
      avatarPreferenceSet: true,
    });
  } catch (error) {
    await deleteStoredAvatar(storedUrl, 'oauth');
    throw error;
  }

  await deleteStoredAvatar(profile.avatarUrl, profile.avatarSource);

  return {
    success: true as const,
    avatarUrl: storedUrl,
    username: profile.username,
  };
}

export async function uploadProfileAvatar(userId: string, file: File) {
  const profile = await getProfileByUserId(userId);

  if (!profile) {
    return null;
  }

  const storedUrl = await storeAvatarFile(userId, file);

  try {
    await updateProfileAvatar(userId, {
      avatarUrl: storedUrl,
      avatarSource: 'upload',
      avatarProvider: null,
      avatarPreferenceSet: true,
    });
  } catch (error) {
    await deleteStoredAvatar(storedUrl, 'upload');
    throw error;
  }

  await deleteStoredAvatar(profile.avatarUrl, profile.avatarSource);

  return {
    url: storedUrl,
    username: profile.username,
  };
}

export async function initializeOAuthAvatarForNewUser(
  userId: string,
  providerAvatarUrl: string | null | undefined,
  profile: {
    avatarUrl: string | null;
    avatarPreferenceSet: boolean;
  }
) {
  if (!providerAvatarUrl) {
    return;
  }

  const provider = getAvatarProviderFromUrl(providerAvatarUrl);

  if (!provider || profile.avatarPreferenceSet || profile.avatarUrl) {
    return;
  }

  let storedAvatarUrl: string | null = null;

  try {
    storedAvatarUrl = await storeAvatarFromUrl(userId, providerAvatarUrl);

    await updateProfileAvatar(userId, {
      avatarUrl: storedAvatarUrl,
      avatarSource: 'oauth',
      avatarProvider: provider,
      avatarPreferenceSet: false,
    });
  } catch (error) {
    if (storedAvatarUrl) {
      await deleteStoredAvatar(storedAvatarUrl, 'oauth');
    }

    console.error('Failed to initialize OAuth avatar for new user:', {
      userId,
      provider,
      error,
    });
  }
}
