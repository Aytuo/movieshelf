'use server';

import { auth } from '@/lib/auth';
import { requireSession } from '@/lib/auth/require-session';
import { db } from '@/lib/db';
import { account } from '@/lib/db/schema';
import { getProfileByUserId, updateProfileAvatar } from '@/lib/repositories';
import {
  deleteStoredAvatar,
  storeAvatarFromUrl,
} from '@/lib/services/profile-avatar-service';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

type AvatarProvider = 'google' | 'discord';

type AccountInfoData = {
  user?: {
    image?: string | null;
  };
  data?: Record<string, unknown>;
};

export async function setAvatarSourceAction(
  source: 'default' | 'oauth',
  provider?: AvatarProvider
) {
  const session = await requireSession();
  const profile = await getProfileByUserId(session.user.id);

  if (!profile) {
    return {
      success: false,
      message: 'Profile not found.',
    };
  }

  let storedUrl: string | null = null;

  try {
    if (source === 'default') {
      await updateProfileAvatar(session.user.id, {
        avatarUrl: null,
        avatarSource: 'default',
        avatarProvider: null,
      });

      await deleteStoredAvatar(profile.avatarUrl, profile.avatarSource);
    } else {
      if (!provider) {
        return {
          success: false,
          message: 'Avatar provider is required.',
        };
      }

      const [linkedAccount] = await db
        .select({
          id: account.id,
        })
        .from(account)
        .where(
          and(
            eq(account.userId, session.user.id),
            eq(account.providerId, provider)
          )
        )
        .limit(1);

      if (!linkedAccount) {
        return {
          success: false,
          message: 'This account is not connected.',
        };
      }

      const info = await auth.api.accountInfo({
        query: {
          accountId: linkedAccount.id,
        },
        headers: await headers(),
      });

      const accountInfo = info as AccountInfoData;

      const rawData = accountInfo.data ?? {};

      const providerImage =
        accountInfo.user?.image ??
        (typeof rawData.picture === 'string' ? rawData.picture : null);

      if (!providerImage) {
        return {
          success: false,
          message: 'This connected account does not provide an avatar.',
        };
      }

      storedUrl = await storeAvatarFromUrl(session.user.id, providerImage);

      await updateProfileAvatar(session.user.id, {
        avatarUrl: storedUrl,
        avatarSource: 'oauth',
        avatarProvider: provider,
      });

      await deleteStoredAvatar(profile.avatarUrl, profile.avatarSource);
    }

    revalidatePath('/settings/profile');
    revalidatePath('/profile');
    revalidatePath(`/profile/${profile.username}`);

    return {
      success: true,
      avatarUrl: storedUrl,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "We couldn't update your avatar.",
    };
  }
}
