'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  setProfileAvatarSource,
  type ProfileAvatarProvider,
} from '@/lib/services/profile-avatar-management-service';
import { revalidatePath } from 'next/cache';

export async function setAvatarSourceAction(
  source: 'default' | 'oauth',
  provider?: ProfileAvatarProvider
) {
  const session = await requireSession();

  try {
    const result = await setProfileAvatarSource(
      session.user.id,
      source,
      provider
    );

    if (!result.success) {
      return result;
    }

    revalidatePath('/settings/profile');
    revalidatePath('/profile');
    revalidatePath(`/profile/${result.username}`);

    return {
      success: true,
      avatarUrl: result.avatarUrl,
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
