import TasteOnboarding from '@/components/onboarding/taste-onboarding';
import { getOnboardingMediaPage } from '@/lib/services/onboarding-service';

const OnboardingPage = async () => {
  const [movieResult, tvResult] = await Promise.all([
    getOnboardingMediaPage('movie'),
    getOnboardingMediaPage('tv'),
  ]);

  return <TasteOnboarding movieResult={movieResult} tvResult={tvResult} />;
};

export default OnboardingPage;
