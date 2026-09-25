import SecuritySettings from '@/components/settings/security-settings';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const SecuritySettingsPage = async () => {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    redirect('/login');
  }

  const sessions = await auth.api.listSessions({
    headers: requestHeaders,
  });

  const initialSessions = sessions.map((item) => ({
    token: item.token,
    createdAt: item.createdAt.toISOString(),
    expiresAt: item.expiresAt.toISOString(),
    userAgent: item.userAgent ?? null,
    ipAddress: item.ipAddress ?? null,
  }));

  return (
    <SecuritySettings
      initialSessions={initialSessions}
      currentSessionToken={session.session.token}
    />
  );
};

export default SecuritySettingsPage;
