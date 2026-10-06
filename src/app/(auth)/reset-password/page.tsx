import AuthVisual from '@/components/auth/auth-visual';
import ResetPasswordForm from '@/components/auth/reset-password-form';
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
            <div>
              <div className="mb-8">
                <p className="text-sm font-medium text-destructive">
                  Password reset
                </p>

                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
                  Reset link expired
                </h1>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  This password reset link is invalid or has expired. Request a
                  new link to continue.
                </p>
              </div>

              <Link
                href="/forgot-password"
                className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Request a new link
              </Link>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link
                  href="/login"
                  className="font-medium text-foreground hover:text-primary"
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
