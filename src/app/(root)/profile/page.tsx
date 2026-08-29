import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { ensureProfile } from '@/lib/services/profile-service';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const ProfileIndexPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const result = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, session.user.id))
    .limit(1);

  const currentProfile = result[0];

  if (!currentProfile) {
    const createdProfile = await ensureProfile({
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });

    redirect(`/profile/${createdProfile.username}`);
  }

  redirect(`/profile/${currentProfile.username.toLowerCase()}`);
};

export default ProfileIndexPage;
