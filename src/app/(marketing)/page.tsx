import MarketingCta from '@/components/marketing/marketing-cta';
import MarketingHero from '@/components/marketing/marketing-hero';
import PhilosophySection from '@/components/marketing/philosophy-section';
import YourShelfSection from '@/components/marketing/your-shelf-section';
import YourTasteSection from '@/components/marketing/your-taste-section';

const MarketingPage = () => {
  return (
    <>
      <MarketingHero />
      <PhilosophySection />
      <YourShelfSection />
      <YourTasteSection />
      <MarketingCta />
    </>
  );
};

export default MarketingPage;
