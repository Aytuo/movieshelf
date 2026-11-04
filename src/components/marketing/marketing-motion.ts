import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MarketingMotionSetup = (root: HTMLElement) => void;

export const withMarketingMotion = (
  root: HTMLElement,
  setup: MarketingMotionSetup
) => {
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)', () => {
    setup(root);
  });

  return () => media.revert();
};
