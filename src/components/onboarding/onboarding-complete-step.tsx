import { ArrowRight, CheckCircle2, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import OnboardingStepIndicator from './onboarding-step-indicator';

type OnboardingCompleteStepProps = {
  onEnter: () => void;
  error: string | null;
  isPending: boolean;
};

const OnboardingCompleteStep = ({
  onEnter,
  error,
  isPending,
}: OnboardingCompleteStepProps) => {
  return (
    <div className="min-h-screen">
      <div className="container-content py-8 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <Link href="/" className="group flex w-fit items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary-glow)] transition-transform duration-200 group-hover:scale-105">
              <Clapperboard className="size-4" strokeWidth={2.2} />
            </span>

            <span className="text-lg font-bold tracking-tight">
              Movie
              <span className="text-primary">Shelf</span>
            </span>
          </Link>

          <OnboardingStepIndicator type="tv" isFinalStep />
        </header>

        <main className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-2xl flex-col items-center justify-center py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </div>

          <p className="eyebrow mt-6">Your taste profile is ready</p>

          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            You&apos;re all set.
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            Your picks will help us recommend movies and series that match your
            taste.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 w-full max-w-xl rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={onEnter}
            disabled={isPending}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_12px_40px_var(--primary-glow)] transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Preparing MovieShelf...' : 'Enter MovieShelf'}

            {!isPending && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </main>
      </div>
    </div>
  );
};

export default OnboardingCompleteStep;
