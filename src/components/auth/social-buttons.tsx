'use client';

import { authClient } from '@/lib/auth/client';
import { Gamepad, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

const SocialButtons = () => {
  const [loading, setLoading] = useState<'google' | 'discord' | null>(null);

  async function signIn(provider: 'google' | 'discord') {
    setLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: '/home',
      });

      if (error) {
        toast.error(
          error.message ??
            `Couldn't continue with ${provider}. Please try again.`
        );
      }
    } catch {
      toast.error(`Couldn't continue with ${provider}. Please try again.`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full bg-surface hover:bg-surface-hover"
        disabled={loading !== null}
        onClick={() => signIn('google')}
      >
        <Gamepad className="size-4" />
        {loading === 'google' ? 'Connecting...' : 'Google'}
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full bg-surface hover:bg-surface-hover"
        disabled={loading !== null}
        onClick={() => signIn('discord')}
      >
        <Gamepad2 className="size-4" />
        {loading === 'discord' ? 'Connecting...' : 'Discord'}
      </Button>
    </div>
  );
};

export default SocialButtons;
