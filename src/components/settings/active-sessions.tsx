'use client';

import { authClient } from '@/lib/auth/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

type ActiveSession = {
  token: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string | null;
  ipAddress: string | null;
};

type ActiveSessionsProps = {
  initialSessions: ActiveSession[];
  currentSessionToken: string;
};

const ActiveSessions = ({
  initialSessions,
  currentSessionToken,
}: ActiveSessionsProps) => {
  const [sessions, setSessions] = useState<ActiveSession[]>(initialSessions);

  const [actionToken, setActionToken] = useState<string | null>(null);
  const [isRevokingOthers, setIsRevokingOthers] = useState(false);

  async function revokeSession(token: string) {
    setActionToken(token);

    const { error: revokeError } = await authClient.revokeSession({
      token,
    });

    if (revokeError) {
      toast.error(revokeError.message ?? "We couldn't revoke this session.");
      setActionToken(null);

      return;
    }

    setSessions((current) =>
      current.filter((session) => session.token !== token)
    );

    toast.success('Session revoked.');
    setActionToken(null);
  }

  async function revokeOtherSessions() {
    setIsRevokingOthers(true);

    const { error: revokeError } = await authClient.revokeOtherSessions();

    if (revokeError) {
      toast.error(
        revokeError.message ?? "We couldn't revoke the other sessions."
      );
      setIsRevokingOthers(false);

      return;
    }

    setSessions((current) =>
      current.filter((session) => session.token === currentSessionToken)
    );

    toast.success('All other sessions have been signed out.');
    setIsRevokingOthers(false);
  }

  return (
    <div className="mt-6 space-y-5">
      {sessions.length > 1 && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void revokeOtherSessions()}
            disabled={isRevokingOthers}
            className="text-primary hover:bg-transparent hover:text-primary/80"
          >
            {isRevokingOthers ? 'Signing out...' : 'Sign out other sessions'}
          </Button>
        </div>
      )}

      <div className="divide-y divide-border/60 rounded-xl border border-border">
        {sessions.map((session) => {
          const isCurrent = session.token === currentSessionToken;
          const isActionPending = actionToken === session.token;

          return (
            <div
              key={session.token}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">
                    {session.userAgent || 'Unknown device'}
                  </p>

                  {isCurrent && (
                    <span className="rounded-full bg-primary-muted px-2 py-0.5 text-[10px] font-semibold tracking-[0.1em] text-primary uppercase">
                      Current session
                    </span>
                  )}
                </div>

                <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                  <p>
                    Started{' '}
                    {new Date(session.createdAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>

                  {session.ipAddress && <p>{session.ipAddress}</p>}

                  <p>
                    Expires{' '}
                    {new Date(session.expiresAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              {!isCurrent && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void revokeSession(session.token)}
                  disabled={isActionPending || isRevokingOthers}
                  className="shrink-0 text-muted-foreground hover:border-destructive/30 hover:text-destructive sm:self-center"
                >
                  {isActionPending ? 'Revoking...' : 'Revoke'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveSessions;
