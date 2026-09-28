'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth/client';
import { useEffect, useState } from 'react';

type ProviderId = 'google' | 'discord';

type ConnectedAccountProfile = {
  displayName: string | null;
  identifier: string | null;
  image: string | null;
};

type ConnectedAccount = {
  id: string;
  providerId: string;
  profile?: ConnectedAccountProfile;
};

const PENDING_UNLINK_KEY = 'movieshelf:pending-unlink-provider';

const providerLabels: Record<ProviderId, string> = {
  google: 'Google',
  discord: 'Discord',
};

function Avatar({
  profile,
  label,
}: {
  profile?: ConnectedAccountProfile;
  label: string;
}) {
  const initials =
    profile?.displayName
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || label.slice(0, 1);

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-hover text-xs font-semibold text-muted-foreground"
      role="img"
      aria-label={`${label} account avatar`}
    >
      {profile?.image ? (
        <div
          className="size-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${profile.image}")` }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

function AccountRow({
  label,
  connected,
  loading,
  actionPending,
  canDisconnect,
  profile,
  onConnect,
  onDisconnect,
}: {
  label: string;
  connected: boolean;
  loading: boolean;
  actionPending: boolean;
  canDisconnect: boolean;
  profile?: ConnectedAccountProfile;
  onConnect?: () => void;
  onDisconnect?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="flex min-w-0 items-center gap-3.5">
        {connected && <Avatar profile={profile} label={label} />}

        <div className="min-w-0">
          <p className="text-sm font-semibold">{label}</p>

          {connected && profile ? (
            <div className="mt-1 min-w-0">
              {profile.displayName && (
                <p className="truncate text-xs text-foreground">
                  {profile.displayName}
                </p>
              )}

              {profile.identifier && (
                <p className="truncate text-xs text-muted-foreground">
                  {profile.identifier}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              {connected
                ? 'Connected to your MovieShelf account.'
                : 'Not connected.'}
            </p>
          )}
        </div>
      </div>

      {!loading && onConnect && onDisconnect ? (
        <button
          type="button"
          onClick={connected ? onDisconnect : onConnect}
          disabled={actionPending || (connected && !canDisconnect)}
          className={[
            'shrink-0 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
            connected
              ? 'border border-border text-muted-foreground hover:bg-surface-hover hover:text-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90',
            'disabled:cursor-not-allowed disabled:opacity-50',
          ].join(' ')}
        >
          {actionPending
            ? 'Please wait...'
            : connected
              ? 'Disconnect'
              : 'Connect'}
        </button>
      ) : (
        !loading && (
          <span
            className={[
              'rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase',
              connected
                ? 'bg-primary-muted text-primary'
                : 'bg-surface-hover text-muted-foreground',
            ].join(' ')}
          >
            {connected ? 'Connected' : 'Not connected'}
          </span>
        )
      )}
    </div>
  );
}

async function loadAccountProfile(
  account: ConnectedAccount
): Promise<ConnectedAccount> {
  if (account.providerId !== 'google' && account.providerId !== 'discord') {
    return account;
  }

  const { data } = await authClient.accountInfo({
    query: {
      accountId: account.id,
    },
  });

  if (!data) {
    return account;
  }

  const raw = (data.data ?? {}) as Record<string, unknown>;

  const nameFromUser =
    typeof data.user?.name === 'string' ? data.user.name : null;

  const emailFromUser =
    typeof data.user?.email === 'string' ? data.user.email : null;

  const rawName = typeof raw.name === 'string' ? raw.name : null;

  const rawGlobalName =
    typeof raw.global_name === 'string' ? raw.global_name : null;

  const rawUsername = typeof raw.username === 'string' ? raw.username : null;

  const image = typeof data.user?.image === 'string' ? data.user.image : null;

  if (account.providerId === 'discord') {
    return {
      ...account,
      profile: {
        displayName: rawGlobalName ?? nameFromUser ?? rawUsername,
        identifier: rawUsername ? `@${rawUsername}` : emailFromUser,
        image,
      },
    };
  }

  return {
    ...account,
    profile: {
      displayName: nameFromUser ?? rawName,
      identifier: emailFromUser,
      image,
    },
  };
}

const ConnectedAccountsPage = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionProvider, setActionProvider] = useState<ProviderId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userEmail, setUserEmail] = useState('');
  const [reauthOpen, setReauthOpen] = useState(false);
  const [reauthTarget, setReauthTarget] = useState<ProviderId | null>(null);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthPending, setReauthPending] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data, error: accountsError }, { data: session }] =
        await Promise.all([authClient.listAccounts(), authClient.getSession()]);

      const nextAccounts = data ?? [];

      if (accountsError) {
        setError(
          accountsError.message ?? "We couldn't load your connected accounts."
        );
        setLoading(false);
        return;
      }

      const enrichedAccounts = await Promise.all(
        nextAccounts.map((account) => loadAccountProfile(account))
      );

      setAccounts(enrichedAccounts);
      setUserEmail(session?.user.email ?? '');
      setLoading(false);

      const pendingProvider = window.sessionStorage.getItem(PENDING_UNLINK_KEY);

      if (pendingProvider === 'google' || pendingProvider === 'discord') {
        window.sessionStorage.removeItem(PENDING_UNLINK_KEY);

        const account = enrichedAccounts.find(
          (item) => item.providerId === pendingProvider
        );

        if (account) {
          setActionProvider(pendingProvider);
          setError(null);

          const result = await authClient.unlinkAccount({
            accountId: account.id,
          });

          if (result.error) {
            setError(
              result.error.message ??
                "We couldn't disconnect this account. Please try again."
            );
          } else {
            setAccounts((current) =>
              current.filter((item) => item.id !== account.id)
            );
          }

          setActionProvider(null);
        }
      }
    }

    void load();
  }, []);

  const getProviderAccount = (providerId: ProviderId) =>
    accounts.find((account) => account.providerId === providerId);

  const credentialConnected = accounts.some(
    (account) => account.providerId === 'credential'
  );

  const connectedSocialProviders = (
    ['google', 'discord'] as ProviderId[]
  ).filter((provider) => Boolean(getProviderAccount(provider)));

  async function unlinkProvider(provider: ProviderId) {
    const account = getProviderAccount(provider);

    if (!account) {
      return;
    }

    setError(null);
    setActionProvider(provider);

    const result = await authClient.unlinkAccount({
      accountId: account.id,
    });

    if (result.error) {
      if (result.error.status === 403) {
        setActionProvider(null);
        setReauthTarget(provider);
        setReauthPassword('');
        setReauthOpen(true);
        return;
      }

      setError(
        result.error.message ??
          `We couldn't disconnect your ${providerLabels[provider]} account.`
      );
      setActionProvider(null);
      return;
    }

    setAccounts((current) => current.filter((item) => item.id !== account.id));

    setActionProvider(null);
  }

  async function connectProvider(provider: ProviderId) {
    setError(null);
    setActionProvider(provider);

    const result = await authClient.linkSocial({
      provider,
      callbackURL: '/settings/accounts',
    });

    if (result.error) {
      setError(
        result.error.message ??
          `We couldn't connect your ${providerLabels[provider]} account.`
      );
      setActionProvider(null);
    }
  }

  async function reauthenticateWithPassword() {
    if (!reauthTarget || !userEmail || !reauthPassword.trim()) {
      return;
    }

    setError(null);
    setReauthPending(true);

    const { error: signInError } = await authClient.signIn.email({
      email: userEmail,
      password: reauthPassword.trim(),
    });

    if (signInError) {
      setError(signInError.message ?? "We couldn't verify your password.");
      setReauthPending(false);
      return;
    }

    const target = reauthTarget;

    setReauthOpen(false);
    setReauthTarget(null);
    setReauthPassword('');
    setReauthPending(false);

    await unlinkProvider(target);
  }

  async function reauthenticateWithSocial(provider: ProviderId) {
    if (!reauthTarget) {
      return;
    }

    setError(null);
    setReauthPending(true);

    window.sessionStorage.setItem(PENDING_UNLINK_KEY, reauthTarget);

    const result = await authClient.signIn.social({
      provider,
      callbackURL: '/settings/accounts',
    });

    if (result.error) {
      window.sessionStorage.removeItem(PENDING_UNLINK_KEY);

      setError(
        result.error.message ??
          `We couldn't re-authenticate with ${providerLabels[provider]}.`
      );
      setReauthPending(false);
    }
  }

  const googleAccount = getProviderAccount('google');
  const discordAccount = getProviderAccount('discord');

  return (
    <>
      <div className="space-y-8">
        <div>
          <p className="eyebrow">Account</p>

          <h2 className="mt-1 font-heading text-2xl font-bold">
            Connected accounts
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the ways you can sign in to MovieShelf.
          </p>
        </div>

        <div className="divide-y divide-border/60 rounded-2xl border border-border surface">
          <AccountRow
            label="Email & password"
            connected={credentialConnected}
            loading={loading}
            actionPending={false}
            canDisconnect={false}
          />

          <AccountRow
            label="Google"
            connected={Boolean(googleAccount)}
            loading={loading}
            actionPending={actionProvider === 'google'}
            canDisconnect={accounts.length > 1}
            profile={googleAccount?.profile}
            onConnect={() => void connectProvider('google')}
            onDisconnect={() => void unlinkProvider('google')}
          />

          <AccountRow
            label="Discord"
            connected={Boolean(discordAccount)}
            loading={loading}
            actionPending={actionProvider === 'discord'}
            canDisconnect={accounts.length > 1}
            profile={discordAccount?.profile}
            onConnect={() => void connectProvider('discord')}
            onDisconnect={() => void unlinkProvider('discord')}
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}
      </div>

      <Dialog
        open={reauthOpen}
        onOpenChange={(nextOpen) => {
          if (!reauthPending) {
            setReauthOpen(nextOpen);

            if (!nextOpen) {
              setReauthPassword('');
              setReauthTarget(null);
            }
          }
        }}
      >
        <DialogContent className="p-6 sm:max-w-md sm:p-7">
          <DialogHeader className="space-y-4">
            {reauthTarget && (
              <div className="flex justify-center">
                <Avatar
                  profile={getProviderAccount(reauthTarget)?.profile}
                  label={providerLabels[reauthTarget]}
                />
              </div>
            )}

            <div className="text-center">
              <DialogTitle className="text-lg">
                Disconnect{' '}
                {reauthTarget
                  ? providerLabels[reauthTarget]
                  : 'connected account'}
              </DialogTitle>

              <DialogDescription className="mx-auto mt-2 max-w-sm leading-6">
                For security, please confirm your identity before disconnecting
                this account from MovieShelf.
              </DialogDescription>
            </div>
          </DialogHeader>

          {credentialConnected ? (
            <div className="mt-6">
              <label
                htmlFor="reauth-password"
                className="mb-2 block text-sm font-medium"
              >
                Current password
              </label>

              <input
                id="reauth-password"
                type="password"
                value={reauthPassword}
                onChange={(event) => {
                  setReauthPassword(event.target.value);
                  setError(null);
                }}
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
                disabled={reauthPending}
              />

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Your password is only used to create a fresh session.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-medium">
                Continue with a connected account
              </p>

              {connectedSocialProviders.map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => void reauthenticateWithSocial(provider)}
                  disabled={reauthPending}
                  className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {reauthPending
                    ? 'Redirecting...'
                    : `Continue with ${providerLabels[provider]}`}
                </button>
              ))}
            </div>
          )}

          <div className="mt-5 rounded-lg border border-border/60 bg-surface-hover/50 px-3.5 py-3">
            <p className="text-xs leading-5 text-muted-foreground">
              Your MovieShelf account will remain active. Only the{' '}
              {reauthTarget
                ? `${providerLabels[reauthTarget]} connection`
                : 'connected account'}{' '}
              will be disconnected.
            </p>
          </div>

          <DialogFooter className="mt-7 gap-3 sm:gap-3">
            <DialogClose
              disabled={reauthPending}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </DialogClose>

            {credentialConnected && (
              <button
                type="button"
                onClick={() => void reauthenticateWithPassword()}
                disabled={!reauthPassword.trim() || reauthPending}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reauthPending ? 'Verifying...' : 'Continue'}
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectedAccountsPage;
