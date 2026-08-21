import MarketingCta from '@/components/marketing/marketing-cta';
import MarketingHero from '@/components/marketing/marketing-hero';
import PhilosophySection from '@/components/marketing/philosophy-section';
import ShelfPreview from '@/components/marketing/shelf-preview';
import TasteSection from '@/components/marketing/taste-section';

const MarketingPage = () => {
  return (
    <>
      <MarketingHero />
      <PhilosophySection />
      <ShelfPreview />
      <TasteSection />
      <MarketingCta />
    </>
  );
};

export default MarketingPage;
