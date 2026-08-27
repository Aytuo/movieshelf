/* ========================================================================== */
/* MEDIA DOMAIN                                                               */
/* ========================================================================== */

export type MediaType = 'movie' | 'tv';

export interface BaseMedia {
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  rating: number;
  voteCount: number;
  originalLanguage: string;
}

export interface Movie extends BaseMedia {
  type: 'movie';
}

export interface TvShow extends BaseMedia {
  type: 'tv';
}

export type Media = Movie | TvShow;

/* ========================================================================== */
/* MEDIA LIST                                                              */
/* ========================================================================== */

export type MediaListItem = Pick<
  Media,
  'tmdbId' | 'type' | 'title' | 'rating' | 'posterPath'
>;

/* ========================================================================== */
/* MEDIA DETAILS                                                               */
/* ========================================================================== */

export interface MediaGenre {
  id: number;
  name: string;
}

export interface MediaCastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface MediaCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

export interface MediaVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface BaseMediaDetails extends BaseMedia {
  tagline: string | null;
  genres: MediaGenre[];
  cast: MediaCastMember[];
  crew: MediaCrewMember[];
  videos: MediaVideo[];
  similar: Media[];
  recommendations: Media[];
}

export interface MovieDetails extends BaseMediaDetails {
  type: 'movie';
  runtime: number | null;
}

export interface TvSeason {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  episodeCount: number;
  airDate: string | null;
  posterPath: string | null;
}

export interface TvCreator {
  id: number;
  name: string;
  profilePath: string | null;
}

export interface TvDetails extends BaseMediaDetails {
  type: 'tv';
  lastAirDate: string | null;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  status: string | null;
  creators: TvCreator[];
  seasons: TvSeason[];
}

export type MediaDetails = MovieDetails | TvDetails;
