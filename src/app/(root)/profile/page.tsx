import { requireSession } from '@/lib/auth/require-session';
import { ensureProfile } from '@/lib/services/profile-service';
import { redirect } from 'next/navigation';

const ProfileIndexPage = async () => {
  const session = await requireSession();

  const profile = await ensureProfile({
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
  });

  redirect(`/profile/${profile.username.toLowerCase()}`);
};

export default ProfileIndexPage;
