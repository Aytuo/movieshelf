import type { Media } from '@/lib/media/types';

/* ========================================================================== */
/*                             RECOMMENDATIONS                                */
/* ========================================================================== */

export type RecommendationReason =
  'because-you-liked' | 'matches-your-taste' | 'explore';

export type MediaRecommendation = {
  media: Media;
  score: number;
  reason: string;
  reasonType: RecommendationReason;
};
