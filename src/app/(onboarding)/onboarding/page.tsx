import TasteOnboarding from '@/components/onboarding/taste-onboarding';
import { getOnboardingCandidates } from '@/lib/services/onboarding-service';

const OnboardingPage = async () => {
  const [movieMedia, tvMedia] = await Promise.all([
    getOnboardingCandidates('movie'),
    getOnboardingCandidates('tv'),
  ]);

  return <TasteOnboarding movieMedia={movieMedia} tvMedia={tvMedia} />;
};

export default OnboardingPage;
