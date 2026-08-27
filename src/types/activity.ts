import { MediaListItem } from '@/lib/media';

/* ========================================================================== */
/*                                  ACTIVITY                                  */
/* ========================================================================== */

export type ActivityItem = {
  id: string;
  type: 'rating' | 'watchlist' | 'favorite' | 'review';
  movie: MediaListItem;
  value?: number;
  createdAt: string;
};
