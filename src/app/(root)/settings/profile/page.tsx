import ProfileAvatarSettings from '@/components/profile/profile-avatar-settings';
import ProfileSettingsForm from '@/components/profile/profile-settings-form';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { account } from '@/lib/db/schema';
import { getProfileByUserId } from '@/lib/repositories';
import { and, eq, inArray } from 'drizzle-orm';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your MovieShelf account and preferences.',
};

type AccountInfoData = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  data?: Record<string, unknown>;
};

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

  const requestHeaders = await headers();

  const oauthAccounts = await db
    .select({
      id: account.id,
      providerId: account.providerId,
    })
    .from(account)
    .where(
      and(
        eq(account.userId, session.user.id),
        inArray(account.providerId, ['google', 'discord'])
      )
    );

  const oauthAvatarAccounts = (
    await Promise.all(
      oauthAccounts.map(async (linkedAccount) => {
        const info = await auth.api.accountInfo({
          query: {
            accountId: linkedAccount.id,
          },
          headers: requestHeaders,
        });

        const accountInfo = info as AccountInfoData;

        const raw = accountInfo.data ?? {};

        const image =
          accountInfo.user?.image ??
          (typeof raw.picture === 'string' ? raw.picture : null);

        return {
          provider: linkedAccount.providerId as 'google' | 'discord',
          label: linkedAccount.providerId === 'google' ? 'Google' : 'Discord',
          displayName: accountInfo.user?.name ?? null,
          identifier:
            linkedAccount.providerId === 'discord'
              ? typeof raw.username === 'string'
                ? `@${raw.username}`
                : (accountInfo.user?.email ?? null)
              : (accountInfo.user?.email ?? null),
          image,
        };
      })
    )
  ).filter(Boolean);

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
        oauthAccounts={oauthAvatarAccounts}
      />

      <ProfileSettingsForm
        initialValues={{
          username: profile.username,
          displayName: profile.displayName ?? '',
          bio: profile.bio ?? '',
          avatarUrl: profile.avatarUrl ?? '',
        }}
      />
    </div>
  );
};

export default ProfileSettingsPage;
