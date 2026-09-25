'use client';

import { authClient } from '@/lib/auth/client';
import { useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function revokeSession(token: string) {
    setError(null);
    setMessage(null);
    setActionToken(token);

    const { error: revokeError } = await authClient.revokeSession({
      token,
    });

    if (revokeError) {
      setError(revokeError.message ?? "We couldn't revoke this session.");
      setActionToken(null);

      return;
    }

    setSessions((current) =>
      current.filter((session) => session.token !== token)
    );

    setMessage('Session revoked.');
    setActionToken(null);
  }

  async function revokeOtherSessions() {
    setError(null);
    setMessage(null);
    setIsRevokingOthers(true);

    const { error: revokeError } = await authClient.revokeOtherSessions();

    if (revokeError) {
      setError(revokeError.message ?? "We couldn't revoke the other sessions.");
      setIsRevokingOthers(false);

      return;
    }

    setSessions((current) =>
      current.filter((session) => session.token === currentSessionToken)
    );

    setMessage('All other sessions have been signed out.');
    setIsRevokingOthers(false);
  }
  if (error && sessions.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      {sessions.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => void revokeOtherSessions()}
            disabled={isRevokingOthers}
            className="text-xs font-semibold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRevokingOthers ? 'Signing out...' : 'Sign out other sessions'}
          </button>
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
                <button
                  type="button"
                  onClick={() => void revokeSession(session.token)}
                  disabled={isActionPending || isRevokingOthers}
                  className="shrink-0 self-start rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/30 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
                >
                  {isActionPending ? 'Revoking...' : 'Revoke'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {message && (
        <div className="rounded-xl border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-primary">
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default ActiveSessions;
