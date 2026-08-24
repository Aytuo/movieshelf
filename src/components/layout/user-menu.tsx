'use client';

import { authClient } from '@/lib/auth/client';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type UserMenuProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };

  profile: {
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
};

const UserMenu = ({ user, profile }: UserMenuProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const avatar = profile.avatarUrl || user.image;

  const displayName = profile.displayName || user.name || profile.username;

  const initials = (displayName || profile.username)
    .trim()
    .slice(0, 1)
    .toUpperCase();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="group inline-flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-surface-hover"
      >
        <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-xs font-bold text-muted-foreground transition-colors group-hover:border-primary/30">
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            initials
          )}
        </span>

        <ChevronDown
          className={[
            'hidden size-3.5 text-muted-foreground transition-transform sm:block',
            open ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-64 overflow-hidden rounded-xl border border-border bg-background/95 p-2 shadow-[0_20px_70px_rgb(0_0_0_/_45%)] backdrop-blur-xl"
        >
          <div className="border-b border-border/60 px-3 py-3">
            <p className="truncate text-sm font-semibold">{displayName}</p>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              @{profile.username}
            </p>

            <p className="mt-1 truncate text-[11px] text-muted-foreground/70">
              {user.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href={`/profile/${profile.username}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <User className="size-4" />
              Profile
            </Link>

            <Link
              href="/settings/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <Settings className="size-4" />
              Settings
            </Link>
          </div>

          <div className="border-t border-border/60 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
