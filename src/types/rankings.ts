import type { Media } from '@/lib/media';

export type RankingType = 'movie' | 'tv';

export type RankingItem = {
  rank: number;
  media: Media;
  score: number;
};

export type Ranking = {
  type: RankingType;
  items: RankingItem[];
  generatedAt: Date;
};
