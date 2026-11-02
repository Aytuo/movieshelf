import AuthVisual from '@/components/auth/auth-visual';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const params = await searchParams;

  const token = params.token ?? '';
  const invalidToken = params.error === 'INVALID_TOKEN' || !token;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">
          {invalidToken ? (
            <div className="rounded-2xl border border-white/10 bg-[#101217]/90 p-6 cinematic-glow backdrop-blur-xl sm:p-10">
              <Link
                href="/"
                aria-label="MovieShelf home"
                className="mb-8 flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Clapperboard className="size-3.5" />
                </span>

                <span className="text-xl font-bold tracking-tight">
                  Movie<span className="text-primary">Shelf</span>
                </span>
              </Link>

              <div className="mb-8 text-center">
                <h1 className="font-heading text-3xl font-bold tracking-tight text-white">
                  Link is no longer valid
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  It may have expired or be invalid. Request a new link to
                  choose a new password.
                </p>
              </div>

              <Link
                href="/forgot-password"
                className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-primary-hover"
              >
                Request a new link
              </Link>

              <p className="mt-8 text-center text-sm text-zinc-400">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
                >
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <ResetPasswordForm token={token} />
          )}
        </div>
      </div>

      <AuthVisual />
    </div>
  );
};

export default ResetPasswordPage;
