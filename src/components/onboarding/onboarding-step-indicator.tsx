import type { MediaType } from '@/lib/media';
import { Check } from 'lucide-react';

type OnboardingStepIndicatorProps = {
  type: MediaType;
  isFinalStep?: boolean;
};

const OnboardingStepIndicator = ({
  type,
  isFinalStep = false,
}: OnboardingStepIndicatorProps) => {
  const currentStep = isFinalStep ? 3 : type === 'movie' ? 1 : 2;

  const circleBase =
    'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200';

  const activeCircle =
    'border-primary/40 bg-primary/10 text-primary ring-2 ring-primary/10 shadow-[0_0_12px_var(--primary-glow)]';

  const completedCircle = 'border-primary/25 bg-primary/10 text-primary';

  const inactiveCircle = 'border-border/70 bg-surface text-muted-foreground';

  const labelBase =
    'whitespace-nowrap text-[9px] font-medium transition-colors duration-200 sm:text-[10px]';

  const activeLabel = 'font-semibold text-primary';
  const inactiveLabel = 'text-muted-foreground';

  const moviesDone = currentStep > 1;
  const tvDone = currentStep > 2;

  return (
    <div
      role="group"
      aria-label={
        isFinalStep
          ? 'Onboarding progress: Movies and TV Series completed. Final stage: Onboarding.'
          : currentStep === 1
            ? 'Onboarding progress: Step 1 of 3, Movies.'
            : 'Onboarding progress: Step 2 of 3, TV Series.'
      }
      className="inline-flex shrink-0 items-start gap-1 sm:gap-2"
    >
      <span className="hidden pt-2 text-xs font-medium tracking-wide text-muted-foreground sm:block">
        Step
      </span>

      <div className="flex items-start">
        {/* Movies */}
        <div className="flex w-14 flex-col items-center gap-1.5 sm:w-16">
          <span
            aria-current={currentStep === 1 ? 'step' : undefined}
            className={`${circleBase} ${
              currentStep === 1
                ? activeCircle
                : moviesDone
                  ? completedCircle
                  : inactiveCircle
            }`}
          >
            {moviesDone ? (
              <Check className="size-3.5" aria-hidden="true" />
            ) : (
              '1'
            )}
          </span>

          <span
            className={`${labelBase} ${
              currentStep === 1 ? activeLabel : inactiveLabel
            }`}
          >
            Movies
          </span>
        </div>

        {/* Movies -> TV Series */}
        <span
          aria-hidden="true"
          className={`mt-3.5 h-px w-2 transition-colors duration-200 sm:w-3 ${
            moviesDone ? 'bg-primary/45' : 'bg-border'
          }`}
        />

        {/* TV Series */}
        <div className="flex w-14 flex-col items-center gap-1.5 sm:w-16">
          <span
            aria-current={currentStep === 2 ? 'step' : undefined}
            className={`${circleBase} ${
              currentStep === 2
                ? activeCircle
                : tvDone
                  ? completedCircle
                  : inactiveCircle
            }`}
          >
            {tvDone ? <Check className="size-3.5" aria-hidden="true" /> : '2'}
          </span>

          <span
            className={`${labelBase} ${
              currentStep === 2 ? activeLabel : inactiveLabel
            }`}
          >
            <span className="sm:hidden">TV</span>
            <span className="hidden sm:inline">TV Series</span>
          </span>
        </div>

        {/* TV Series -> Onboarding */}
        <span
          aria-hidden="true"
          className={`mt-3.5 h-px w-2 transition-colors duration-200 sm:w-3 ${
            tvDone ? 'bg-primary/45' : 'bg-border'
          }`}
        />

        {/* Final stage */}
        <div className="flex w-14 flex-col items-center gap-1.5 sm:w-16">
          <span
            aria-current={currentStep === 3 ? 'step' : undefined}
            className={`${circleBase} ${
              currentStep === 3 ? activeCircle : inactiveCircle
            }`}
          >
            <Check className="size-3.5" aria-hidden="true" />
          </span>

          <span
            className={`${labelBase} ${
              currentStep === 3 ? activeLabel : inactiveLabel
            }`}
          >
            Onboarding
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepIndicator;
