import { MediaType } from '@/lib/media';

/* ========================================================================== */
/*                                  TASTE                                     */
/* ========================================================================== */

export type TasteGenre = {
  name: string;
  count: number;
  percentage: number;
};

export type TasteDecade = {
  decade: string;
  count: number;
  percentage: number;
};

export type RatingDistributionItem = {
  rating: number;
  count: number;
};

export type TasteMedia = {
  id: string;
  tmdbId: number;
  type: MediaType;
  title: string;
  posterPath: string | null;
  rating: number;
};

export type TasteStats = {
  total: number;
  watched: number;
  watchlist: number;
  favorite: number;
  rated: number;
  averageRating: number | null;
  topGenres: TasteGenre[];
  favoriteDecades: TasteDecade[];
  ratingDistribution: RatingDistributionItem[];
  highestRated: TasteMedia[];
  lowestRated: TasteMedia[];
};

export type TasteProfile = {
  movie: TasteStats;
  tv: TasteStats;
};
