'use client';

import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type OAuthProvider = 'google' | 'discord';

type SessionReauthenticationProps = {
  userEmail: string;
  hasPassword: boolean;
  oauthProviders: OAuthProvider[];
};

const providerLabels: Record<OAuthProvider, string> = {
  google: 'Google',
  discord: 'Discord',
};

const SessionReauthentication = ({
  userEmail,
  hasPassword,
  oauthProviders,
}: SessionReauthenticationProps) => {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [passwordPending, setPasswordPending] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(
    null
  );

  async function reauthenticateWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password.trim() || passwordPending || pendingProvider) {
      return;
    }

    setPasswordPending(true);

    try {
      const { error } = await authClient.signIn.email({
        email: userEmail,
        password: password.trim(),
        callbackURL: '/settings/security',
      });

      if (error) {
        toast.error(error.message ?? "We couldn't verify your password.");
        setPasswordPending(false);
        return;
      }

      setPassword('');
      router.replace('/settings/security');
      router.refresh();
    } catch {
      toast.error("We couldn't verify your identity. Please try again.");
      setPasswordPending(false);
    }
  }

  async function reauthenticateWithSocial(provider: OAuthProvider) {
    if (passwordPending || pendingProvider) {
      return;
    }

    setPendingProvider(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: '/settings/security',
      });

      if (error) {
        toast.error(
          error.message ??
            `We couldn't continue with ${providerLabels[provider]}.`
        );
        setPendingProvider(null);
      }
    } catch {
      toast.error(`We couldn't continue with ${providerLabels[provider]}.`);
      setPendingProvider(null);
    }
  }

  const pending = passwordPending || pendingProvider !== null;

  return (
    <div className="mt-6 border-t border-border/60 pt-5">
      <h4 className="text-sm font-semibold">Verify your identity</h4>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Your session is still active, but you need to verify your identity
        before viewing or managing active sessions.
      </p>

      {hasPassword && (
        <form onSubmit={reauthenticateWithPassword} className="mt-5 space-y-3">
          <div>
            <label
              htmlFor="session-reauth-password"
              className="mb-2 block text-sm font-medium"
            >
              Current password
            </label>

            <Input
              id="session-reauth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={pending}
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!password.trim() || pending}
            className="h-10"
          >
            {passwordPending ? 'Verifying...' : 'Verify identity'}
          </Button>
        </form>
      )}

      {oauthProviders.length > 0 && (
        <div className={hasPassword ? 'mt-5 space-y-3' : 'mt-5 space-y-3'}>
          <p className="text-xs text-muted-foreground">
            {hasPassword
              ? 'Or continue with a connected account'
              : 'Continue with a connected account'}
          </p>

          {oauthProviders.map((provider) => (
            <Button
              key={provider}
              type="button"
              variant="outline"
              size="lg"
              disabled={pending}
              onClick={() => void reauthenticateWithSocial(provider)}
              className="h-10 w-full"
            >
              {pendingProvider === provider
                ? 'Redirecting...'
                : `Continue with ${providerLabels[provider]}`}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionReauthentication;
