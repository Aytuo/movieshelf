import SecuritySettings from '@/components/settings/security-settings';
import { auth } from '@/lib/auth';
import { getSessionReauthenticationOptions } from '@/lib/services/session-security-sevice';
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

  let sessions: Awaited<ReturnType<typeof auth.api.listSessions>> = [];

  let sessionsRequireReauthentication = false;

  try {
    sessions = await auth.api.listSessions({
      headers: requestHeaders,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Session is not fresh') {
      sessionsRequireReauthentication = true;
    } else {
      throw error;
    }
  }

  const reauthenticationOptions = sessionsRequireReauthentication
    ? await getSessionReauthenticationOptions(session.user.id)
    : {
        hasPassword: false,
        oauthProviders: [] as ('google' | 'discord')[],
      };

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
      sessionsRequireReauthentication={sessionsRequireReauthentication}
      userEmail={session.user.email}
      hasPassword={reauthenticationOptions.hasPassword}
      oauthProviders={reauthenticationOptions.oauthProviders}
    />
  );
};

export default SecuritySettingsPage;
