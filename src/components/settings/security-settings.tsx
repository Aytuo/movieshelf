import ActiveSessions from './active-sessions';
import DeleteAccountSettings from './delete-account-settings';
import PasswordSettings from './password-settings';

type SecuritySettingsProps = {
  initialSessions: {
    token: string;
    createdAt: string;
    expiresAt: string;
    userAgent: string | null;
    ipAddress: string | null;
  }[];

  currentSessionToken: string;
};

const SecuritySettings = ({
  initialSessions,
  currentSessionToken,
}: SecuritySettingsProps) => {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Security</p>

        <h2 className="mt-2 font-heading text-2xl font-bold">
          Security settings
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Manage your password, active sessions, and account security.
        </p>
      </div>

      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <div>
          <h3 className="text-sm font-semibold">Password</h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Change your password or set one for an account that currently uses
            only social sign-in.
          </p>
        </div>

        <PasswordSettings />
      </section>

      <section className="rounded-2xl border border-border p-5 surface sm:p-7">
        <div>
          <h3 className="text-sm font-semibold">Active sessions</h3>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Review where your MovieShelf account is currently signed in.
          </p>
        </div>

        <ActiveSessions
          initialSessions={initialSessions}
          currentSessionToken={currentSessionToken}
        />
      </section>

      <section className="rounded-2xl border border-destructive/30 p-5 sm:p-7">
        <div>
          <h3 className="text-sm font-semibold text-destructive">
            Delete account
          </h3>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
            Permanently delete your MovieShelf account and all data associated
            with it. This action cannot be undone.
          </p>
        </div>

        <DeleteAccountSettings />
      </section>
    </div>
  );
};

export default SecuritySettings;
