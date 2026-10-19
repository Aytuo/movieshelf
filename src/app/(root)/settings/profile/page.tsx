import ProfileAvatarSettings from '@/components/profile/profile-avatar-settings';
import ProfileSettingsForm from '@/components/profile/profile-settings-form';
import { auth } from '@/lib/auth';
import { getOAuthAvatarAccounts } from '@/lib/services/oauth-avatar-service';
import { getProfileSettings } from '@/lib/services/profile-service';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your MovieShelf account and preferences.',
};

const ProfileSettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const profile = await getProfileSettings(session.user.id);

  if (!profile) {
    redirect('/home');
  }

  const oauthAvatarAccounts = await getOAuthAvatarAccounts(session.user.id);

  const fallbackOAuthAccount = oauthAvatarAccounts.find(
    (account) =>
      account.image &&
      session.user.image &&
      account.image === session.user.image
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Profile</p>

        <h2 className="mt-2 font-heading text-2xl font-bold">
          Profile settings
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Customize how you appear across MovieShelf.
        </p>
      </div>

      <ProfileAvatarSettings
        username={profile.username}
        initialSource={
          profile.avatarSource === 'default' && profile.avatarUrl
            ? 'upload'
            : profile.avatarSource
        }
        initialProvider={profile.avatarProvider}
        initialAvatarUrl={profile.avatarUrl}
        fallbackAvatarUrl={
          !profile.avatarPreferenceSet ? (session.user.image ?? null) : null
        }
        fallbackAvatarProvider={
          !profile.avatarPreferenceSet
            ? (fallbackOAuthAccount?.provider ?? null)
            : null
        }
        oauthAccounts={oauthAvatarAccounts}
      />

      <ProfileSettingsForm
        initialValues={{
          username: profile.username,
          displayName: profile.displayName ?? '',
          bio: profile.bio ?? '',
        }}
      />
    </div>
  );
};

export default ProfileSettingsPage;
