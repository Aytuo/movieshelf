import ProfileSettingsForm from '@/components/profile/profile-settings-form';
import { auth } from '@/lib/auth';
import { getProfileByUserId } from '@/lib/repositories/profile-repository';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const ProfileSettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) {
    redirect('/home');
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Profile</p>

        <h2 className="mt-1 font-heading text-2xl font-bold">Settings</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Customize how you appear across MovieShelf.
        </p>
      </div>

      <ProfileSettingsForm
        initialValues={{
          username: profile.username,
          displayName: profile.displayName ?? '',
          bio: profile.bio ?? '',
          avatarUrl: profile.avatarUrl ?? '',
        }}
        fallbackAvatar={session.user.image ?? null}
      />
    </div>
  );
};

export default ProfileSettingsPage;
