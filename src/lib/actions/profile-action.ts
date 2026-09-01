'use server';

import { requireSession } from '@/lib/auth/require-session';
import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from '@/lib/validations/profile';
import { revalidatePath } from 'next/cache';
import { updateProfile } from '../repositories';
import { isUsernameAvailable } from '../services/profile-service';

export type ProfileActionResult = {
  success: boolean;
  message?: string;
  field?: 'username' | 'general';
};

export async function updateProfileSettings(
  input: ProfileUpdateInput
): Promise<ProfileActionResult> {
  const session = await requireSession();

  const parsed = profileUpdateSchema.safeParse(input);

  if (!parsed.success) {
    const usernameError = parsed.error.issues.find(
      (issue) => issue.path[0] === 'username'
    );

    return {
      success: false,
      message:
        usernameError?.message ?? 'Please check your profile information.',
      field: usernameError ? 'username' : 'general',
    };
  }

  const username = parsed.data.username.trim().toLowerCase();

  const available = await isUsernameAvailable(username, session.user.id);

  if (!available) {
    return {
      success: false,
      field: 'username',
      message: 'That username is already taken.',
    };
  }

  try {
    await updateProfile(session.user.id, {
      username,
      displayName: parsed.data.displayName?.trim() || null,
      bio: parsed.data.bio?.trim() || null,
      avatarUrl: parsed.data.avatarUrl?.trim() || null,
    });
  } catch {
    return {
      success: false,
      field: 'username',
      message:
        "We couldn't save your profile. The username may already be taken.",
    };
  }

  revalidatePath('/home');
  revalidatePath('/profile');
  revalidatePath(`/profile/${username}`);
  revalidatePath(`/profile/${username}/taste`);
  revalidatePath('/settings');
  revalidatePath('/settings/profile');

  return {
    success: true,
    message: 'Your profile has been updated.',
  };
}
