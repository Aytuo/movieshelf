import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type {
  account,
  comment,
  media,
  mediaInteraction,
  post,
  reaction,
  review,
  session,
  user,
  verification,
} from './newSchema';

/* ========================================================================== */
/*                              DATABASE TYPES                                */
/* ========================================================================== */

/**
 * BetterAuth
 */
export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export type Session = InferSelectModel<typeof session>;
export type NewSession = InferInsertModel<typeof session>;

export type Account = InferSelectModel<typeof account>;
export type NewAccount = InferInsertModel<typeof account>;

export type Verification = InferSelectModel<typeof verification>;
export type NewVerification = InferInsertModel<typeof verification>;

/**
 * Media
 */
export type Media = InferSelectModel<typeof media>;
export type NewMedia = InferInsertModel<typeof media>;

/**
 * User ↔ Media relationship
 */
export type MediaInteraction = InferSelectModel<typeof mediaInteraction>;

export type NewMediaInteraction = InferInsertModel<typeof mediaInteraction>;

/**
 * Reviews
 */
export type Review = InferSelectModel<typeof review>;
export type NewReview = InferInsertModel<typeof review>;

/**
 * Community
 */
export type Post = InferSelectModel<typeof post>;
export type NewPost = InferInsertModel<typeof post>;

export type Comment = InferSelectModel<typeof comment>;
export type NewComment = InferInsertModel<typeof comment>;

export type Reaction = InferSelectModel<typeof reaction>;
export type NewReaction = InferInsertModel<typeof reaction>;

/* ========================================================================== */
/*                                ENUM TYPES                                  */
/* ========================================================================== */

export type MediaType = 'movie' | 'tv' | 'episode';
export type MediaStatus = 'watchlist' | 'watching' | 'watched' | 'dropped';
export type ReactionType = 'like';

/* ========================================================================== */
/*                              TMDB BASE TYPES                               */
/* ========================================================================== */

export type TMDBMediaType = 'movie' | 'tv' | 'person';

/**
 * Common fields returned by TMDB for movie/tv search results.
 */
export interface TMDBSearchResultBase {
  id: number;
  media_type: TMDBMediaType;
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

/* ========================================================================== */
/*                              TMDB MOVIE TYPES                              */
/* ========================================================================== */

export interface TMDBMovieSearchResult extends TMDBSearchResultBase {
  media_type: 'movie';
  original_title: string;
  title: string;
  release_date: string;
  video: boolean;
}

/* ========================================================================== */
/*                               TMDB TV TYPES                                */
/* ========================================================================== */

export interface TMDBTVSearchResult extends TMDBSearchResultBase {
  media_type: 'tv';
  original_name: string;
  name: string;
  first_air_date: string;
}

/* ========================================================================== */
/*                            TMDB MULTI SEARCH                               */
/* ========================================================================== */

export type TMDBMultiSearchResult = TMDBMovieSearchResult | TMDBTVSearchResult;

export interface TMDBMultiSearchResponse {
  page: number;
  results: TMDBMultiSearchResult[];
  total_pages: number;
  total_results: number;
}

/* ========================================================================== */
/*                              MOVIESHELF TYPES                              */
/* ========================================================================== */

/**
 * A normalized media object used by MovieShelf UI.
 *
 * This type intentionally does not mirror TMDB exactly.
 */
export interface MediaSearchResult {
  tmdbId: number;
  type: 'movie' | 'tv';
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  rating: number;
  voteCount: number;
}

/* ========================================================================== */
/*                             MEDIA DETAILS                                  */
/* ========================================================================== */

export interface MediaDetails {
  tmdbId: number;
  type: MediaType;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  rating: number;
  voteCount: number;
  genres: MediaGenre[];
  runtime: number | null;
}

export interface MediaGenre {
  id: number;
  name: string;
}

/* ========================================================================== */
/*                            USER SHELF TYPES                                */
/* ========================================================================== */

export interface ShelfItem {
  media: Media;
  interaction: MediaInteraction;
}

export interface UserShelf {
  items: ShelfItem[];
  total: number;
}

/* ========================================================================== */
/*                              REVIEW TYPES                                  */
/* ========================================================================== */

export interface ReviewWithAuthor extends Review {
  author: Pick<User, 'id' | 'name' | 'image'>;
}

/* ========================================================================== */
/*                              POST TYPES                                    */
/* ========================================================================== */

export interface PostWithAuthor extends Post {
  author: Pick<User, 'id' | 'name' | 'image'>;
}

export interface PostWithDetails extends PostWithAuthor {
  media: Media;
  comments: CommentWithAuthor[];
  reactionCount: number;
  userHasReacted: boolean;
}

/* ========================================================================== */
/*                             COMMENT TYPES                                 */
/* ========================================================================== */

export interface CommentWithAuthor extends Comment {
  author: Pick<User, 'id' | 'name' | 'image'>;
  replies?: CommentWithAuthor[];
}

/* ========================================================================== */
/*                            REACTION TYPES                                  */
/* ========================================================================== */

export interface ReactionWithUser extends Reaction {
  user: Pick<User, 'id' | 'name' | 'image'>;
}

/* ========================================================================== */
/*                              API TYPES                                     */
/* ========================================================================== */

/**
 * Generic API response.
 */
export interface ApiResponse<T> {
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  data: null;
  error: {
    message: string;
    code?: string;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

/* ========================================================================== */
/*                              PAGINATION                                    */
/* ========================================================================== */

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/* ========================================================================== */
/*                              SEARCH TYPES                                  */
/* ========================================================================== */

export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: MediaSearchResult[];
  pagination: Pagination;
}
