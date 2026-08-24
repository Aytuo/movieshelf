'use client';

import { authClient } from '@/lib/auth/client';
import { useEffect, useState } from 'react';

type ConnectedAccount = {
  id: string;
  providerId: string;
};

function AccountRow({
  label,
  connected,
  loading,
}: {
  label: string;
  connected: boolean;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-semibold">{label}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {connected
            ? 'Connected to your MovieShelf account.'
            : 'Not connected.'}
        </p>
      </div>

      {!loading && (
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
      )}
    </div>
  );
}

const ConnectedAccountsPage = () => {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await authClient.listAccounts();

      setAccounts(data ?? []);

      setLoading(false);
    }

    void load();
  }, []);

  const hasProvider = (providerId: string) =>
    accounts.some((account) => account.providerId === providerId);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-primary">Account</p>

        <h2 className="mt-1 font-heading text-2xl font-bold">
          Connected accounts
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Manage the ways you can sign in to MovieShelf.
        </p>
      </div>

      <div className="divide-y divide-border/60 rounded-2xl border border-border surface">
        <AccountRow
          label="Email & password"
          connected={hasProvider('credential')}
          loading={loading}
        />

        <AccountRow
          label="Google"
          connected={hasProvider('google')}
          loading={loading}
        />

        <AccountRow
          label="Discord"
          connected={hasProvider('discord')}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ConnectedAccountsPage;
