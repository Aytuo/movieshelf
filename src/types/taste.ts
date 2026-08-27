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

export type TasteProfile = {
  totalMovies: number;
  watchedMovies: number;
  watchlistMovies: number;
  favoriteMovies: number;
  ratedMovies: number;
  averageRating: number | null;
  topGenres: TasteGenre[];
  favoriteDecades: TasteDecade[];
  ratingDistribution: RatingDistributionItem[];
  highestRatedMovies: {
    id: string;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    rating: number;
  }[];
  lowestRatedMovies: {
    id: string;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    rating: number;
  }[];
};
