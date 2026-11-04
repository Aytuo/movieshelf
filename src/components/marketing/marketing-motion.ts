import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MarketingMotionSetup = (root: HTMLElement) => void;

type MarketingScrollPosition = string | (() => string);

type MarketingScrollTimelineOptions = {
  start: MarketingScrollPosition;
  end: MarketingScrollPosition;
  scrub?: boolean | number;
};

type MarketingIntroOptions = {
  trigger: HTMLElement;
  eyebrow?: HTMLElement | null;
  title?: HTMLElement | null;
  titleLines?: NodeListOf<HTMLElement>;
  description?: HTMLElement | null;
  start?: MarketingScrollPosition;
  end?: MarketingScrollPosition;
  scrub?: boolean | number;
};

export const createMarketingScrollTimeline = (
  trigger: HTMLElement,
  { start, end, scrub = true }: MarketingScrollTimelineOptions
) => {
  return gsap.timeline({
    defaults: {
      ease: 'none',
    },
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
    },
  });
};

export const createMarketingIntroTimeline = ({
  trigger,
  eyebrow,
  title,
  titleLines,
  description,
  start = 'top 88%',
  end = 'top 42%',
  scrub = true,
}: MarketingIntroOptions) => {
  const lines = titleLines ? Array.from(titleLines) : [];

  // Eyebrow initial state.
  if (eyebrow) {
    gsap.set(eyebrow, {
      opacity: 0,
      y: 16,
    });
  }

  // Title initial state.
  if (lines.length > 0) {
    gsap.set(lines, {
      opacity: 0,
      yPercent: 110,
    });
  } else if (title) {
    gsap.set(title, {
      opacity: 0,
      y: 30,
    });
  }

  // Description initial state.
  if (description) {
    gsap.set(description, {
      opacity: 0,
      y: 20,
    });
  }

  const timeline = createMarketingScrollTimeline(trigger, {
    start,
    end,
    scrub,
  });

  // 1. Eyebrow.
  if (eyebrow) {
    timeline.to(eyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.55,
    });
  }

  const titlePosition = eyebrow ? 0.68 : 0;

  // 2. Title.
  let descriptionPosition = titlePosition;

  if (lines.length > 0) {
    timeline.to(
      lines,
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.88,
        stagger: 0.13,
      },
      titlePosition
    );

    descriptionPosition =
      titlePosition + 0.88 + (lines.length - 1) * 0.13 + 0.16;
  } else if (title) {
    timeline.to(
      title,
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
      },
      titlePosition
    );

    descriptionPosition = titlePosition + 0.9 + 0.16;
  }

  // 3. Description.
  if (description) {
    timeline.to(
      description,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      },
      descriptionPosition
    );
  }

  return timeline;
};

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
