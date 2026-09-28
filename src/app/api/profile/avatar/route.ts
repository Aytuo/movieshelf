import { auth } from '@/lib/auth';
import { getProfileByUserId, updateProfileAvatar } from '@/lib/repositories';
import {
  deleteStoredAvatar,
  storeAvatarFile,
} from '@/lib/services/profile-avatar-service';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json(
      { message: 'Image file is required.' },
      { status: 400 }
    );
  }

  try {
    const profile = await getProfileByUserId(session.user.id);

    if (!profile) {
      return NextResponse.json(
        { message: 'Profile not found.' },
        { status: 404 }
      );
    }

    const url = await storeAvatarFile(session.user.id, file);

    await updateProfileAvatar(session.user.id, {
      avatarUrl: url,
      avatarSource: 'upload',
      avatarProvider: null,
      avatarPreferenceSet: true,
    });

    await deleteStoredAvatar(profile.avatarUrl, profile.avatarSource);

    revalidatePath('/settings/profile');
    revalidatePath('/profile');
    revalidatePath(`/profile/${profile.username}`);

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "We couldn't upload your avatar.",
      },
      { status: 400 }
    );
  }
}
