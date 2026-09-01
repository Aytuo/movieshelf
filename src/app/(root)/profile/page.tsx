import { requireSession } from '@/lib/auth/require-session';
import { getProfileByUserId } from '@/lib/repositories';
import { ensureProfile } from '@/lib/services/profile-service';
import { redirect } from 'next/navigation';

const ProfileIndexPage = async () => {
  const session = await requireSession();

  const currentProfile = await getProfileByUserId(session.user.id);

  if (!currentProfile) {
    const createdProfile = await ensureProfile({
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });

    redirect(`/profile/${createdProfile.username.toLowerCase()}`);
  }

  redirect(`/profile/${currentProfile.username.toLowerCase()}`);
};

export default ProfileIndexPage;
