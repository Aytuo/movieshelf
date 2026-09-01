export type MediaRecord = {
  id: string;
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  originalTitle: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
};

export type MediaInteraction = {
  status: 'watchlist' | 'watching' | 'watched' | 'dropped';
  favorite: boolean;
  rating: number | null;
};
