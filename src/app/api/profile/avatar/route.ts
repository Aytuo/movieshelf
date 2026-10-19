import { auth } from '@/lib/auth';
import { uploadProfileAvatar } from '@/lib/services/profile-avatar-management-service';
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
    const result = await uploadProfileAvatar(session.user.id, file);

    if (!result) {
      return NextResponse.json(
        { message: 'Profile not found.' },
        { status: 404 }
      );
    }

    revalidatePath('/settings/profile');
    revalidatePath('/profile');
    revalidatePath(`/profile/${result.username}`);

    return NextResponse.json({
      success: true,
      url: result.url,
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
