'use client';

import { authClient } from '@/lib/auth/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.85 0-5.26-1.92-6.12-4.5H2.2v2.84C4.01 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.88 13.07c-.22-.66-.35-1.36-.35-2.07s.13-1.41.35-2.07V6.09H2.2C1.43 7.61 1 9.26 1 11s.43 3.39 1.2 4.91l2.88-2.24z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.01 3.39 2.2 6.09l3.68 2.84C6.74 6.35 9.15 5.38 12 5.38z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 shrink-0"
      fill="#5865F2"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8658-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3911-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.07.07 0 0 0-.0321.0277C.5334 9.0458-.3203 13.5793.0992 18.0578a.0824.0824 0 0 0 .0312.0561 19.9 19.9 0 0 0 5.993 3.028.0777.0777 0 0 0 .0842-.0272c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057 13.1 13.1 0 0 1-1.872-.8926.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0742.0742 0 0 1 .0785.0095c.1201.0992.246.1971.3728.2914a.077.077 0 0 1-.0066.1277 12.3 12.3 0 0 1-1.873.8935.0766.0766 0 0 0-.0406.1066c.3604.698.771 1.3628 1.225 1.9933a.076.076 0 0 0 .0842.0281 19.876 19.876 0 0 0 6.002-3.028.077.077 0 0 0 .0303-.0552c.5004-5.1772-.8382-9.673-3.5485-13.6604a.061.061 0 0 0-.0312-.0277zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.212 0 2.176 1.096 2.157 2.419 0 1.334-.955 2.419-2.157 2.419zm7.961 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.212 0 2.176 1.096 2.157 2.419 0 1.334-.955 2.419-2.157 2.419z" />
    </svg>
  );
}

const SocialButtons = () => {
  const [loading, setLoading] = useState<'google' | 'discord' | null>(null);

  async function signIn(provider: 'google' | 'discord') {
    setLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: '/home',
        newUserCallbackURL: '/onboarding',
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
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full justify-center gap-3 bg-surface px-4 hover:bg-surface-hover"
        disabled={loading !== null}
        onClick={() => signIn('google')}
      >
        <GoogleIcon />
        <span>
          {loading === 'google' ? 'Connecting...' : 'Continue with Google'}
        </span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full justify-center gap-3 bg-surface px-4 hover:bg-surface-hover"
        disabled={loading !== null}
        onClick={() => signIn('discord')}
      >
        <DiscordIcon />
        <span>
          {loading === 'discord' ? 'Connecting...' : 'Continue with Discord'}
        </span>
      </Button>
    </div>
  );
};

export default SocialButtons;
