'use client';

import { authClient } from '@/lib/auth/client';
import { Gamepad, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

const SocialButtons = () => {
  const [loading, setLoading] = useState<'google' | 'discord' | null>(null);

  async function signIn(provider: 'google' | 'discord') {
    setLoading(provider);

    await authClient.signIn.social({
      provider,
      callbackURL: '/home',
    });

    setLoading(null);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => signIn('google')}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-medium transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* TODO: Replace with Google logo */}
        <Gamepad className="size-4" />

        {loading === 'google' ? 'Connecting...' : 'Google'}
      </button>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => signIn('discord')}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-medium transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Gamepad2 className="size-4" />

        {loading === 'discord' ? 'Connecting...' : 'Discord'}
      </button>
    </div>
  );
};

export default SocialButtons;
