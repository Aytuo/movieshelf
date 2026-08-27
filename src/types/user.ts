/* ========================================================================== */
/*                                  USER                                      */
/* ========================================================================== */

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
};

export type UserStats = {
  moviesRated: number;
  moviesWatched: number;
  watchlistCount: number;
  favoriteCount: number;
};
