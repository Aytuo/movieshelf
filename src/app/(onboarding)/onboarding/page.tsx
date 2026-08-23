import TasteOnboarding from '@/components/onboarding/taste-onboarding';
import { getOnboardingCandidates } from '@/lib/services/onboarding-service';

const OnboardingPage = async () => {
  const movies = await getOnboardingCandidates();

  return <TasteOnboarding movies={movies} />;
};

export default OnboardingPage;
