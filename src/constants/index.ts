/**
 * MovieShelf — constants & mock data
 *
 * Keep UI-ready static data here while the application is being built without
 * the TMDB/API layer. When the API is connected, components can keep consuming
 * the same data shapes and replace these sources with real responses.
 */

export type NavLink = {
  label: string;
  href: string;
  icon?: string;
};

export type Movie = {
  id: number;
  title: string;
  originalTitle?: string;
  year: number;
  rating: number;
  voteCount?: number;
  genres: string[];
  runtime?: number;
  certification?: string;
  overview: string;
  posterPath: string;
  backdropPath?: string;
};

export type MovieListItem = Pick<
  Movie,
  'id' | 'title' | 'year' | 'rating' | 'posterPath'
>;

export type UserStats = {
  moviesRated: number;
  moviesWatched: number;
  watchlistCount: number;
  favoriteCount: number;
};

export type ActivityItem = {
  id: string;
  type: 'rating' | 'watchlist' | 'favorite' | 'review';
  movie: MovieListItem;
  value?: number;
  createdAt: string;
};

/* -------------------------------------------------------------------------- */
/* Site                                                                       */
/* -------------------------------------------------------------------------- */

export const SITE_CONFIG = {
  name: 'MovieShelf',
  description:
    'Discover, rate and organize movies in your own personal movie shelf.',
} as const;

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', icon: 'house' },
  { label: 'Discover', href: '/discover', icon: 'compass' },
  { label: 'My Shelf', href: '/shelf', icon: 'library' },
  { label: 'Favorites', href: '/favorites', icon: 'heart' },
];

export const ACCOUNT_NAV_LINKS: NavLink[] = [
  { label: 'Profile', href: '/profile', icon: 'user' },
  { label: 'Settings', href: '/settings', icon: 'settings' },
];

/* -------------------------------------------------------------------------- */
/* Home / Hero                                                                */
/* -------------------------------------------------------------------------- */

export const HERO_CONTENT = {
  eyebrow: 'Your personal movie space',
  title: 'Your movies. Your taste. Your shelf.',
  description:
    "Discover films worth remembering, keep track of what you've seen, rate your favorites and build a movie collection that is truly yours.",
  primaryCta: { label: 'Discover movies', href: '/discover' },
  secondaryCta: { label: 'View my shelf', href: '/shelf' },
} as const;

export const HOME_SECTION_TITLES = {
  trending: {
    title: 'Trending now',
    description: 'See what movie lovers are talking about right now.',
  },
  recommended: {
    title: 'Picked for your taste',
    description: 'Movies selected based on your activity and ratings.',
  },
  watchlist: {
    title: 'From your watchlist',
    description: 'Keep the movies you want to see within easy reach.',
  },
  popular: {
    title: 'Popular on MovieShelf',
    description: 'A selection of movies loved by the community.',
  },
  recentlyRated: {
    title: 'Recently rated',
    description: 'Your latest movie ratings and activity.',
  },
} as const;

/* -------------------------------------------------------------------------- */
/* TMDB mock data                                                             */
/* -------------------------------------------------------------------------- */

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const MOCK_MOVIES: Movie[] = [
  {
    id: 872585,
    title: 'Oppenheimer',
    year: 2023,
    rating: 8.1,
    voteCount: 9000,
    genres: ['Drama', 'History'],
    runtime: 180,
    certification: 'R',
    overview:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg`,
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    year: 2024,
    rating: 8.2,
    voteCount: 7000,
    genres: ['Science Fiction', 'Adventure'],
    runtime: 166,
    certification: 'PG-13',
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/7c6Vq8r8h5HhKxYQ6rH9VhJ5X4K.jpg`,
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    year: 2023,
    rating: 8.3,
    voteCount: 7000,
    genres: ['Animation', 'Action', 'Adventure'],
    runtime: 140,
    certification: 'PG',
    overview:
      'Miles Morales catapults across the Multiverse and encounters a team of Spider-People charged with protecting its very existence.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg`,
  },
  {
    id: 155,
    title: 'The Dark Knight',
    year: 2008,
    rating: 8.5,
    voteCount: 32000,
    genres: ['Drama', 'Action', 'Crime'],
    runtime: 152,
    certification: 'PG-13',
    overview:
      'Batman faces a criminal mastermind whose reign of chaos pushes Gotham and its heroes to their limits.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg`,
  },
  {
    id: 157336,
    title: 'Interstellar',
    year: 2014,
    rating: 8.4,
    voteCount: 35000,
    genres: ['Science Fiction', 'Drama', 'Adventure'],
    runtime: 169,
    certification: 'PG-13',
    overview:
      "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    posterPath: `${TMDB_IMAGE_BASE}/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/xJHokMbljvjADYdit5fK5e3K5mM.jpg`,
  },
  {
    id: 496243,
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    voteCount: 19000,
    genres: ['Comedy', 'Thriller', 'Drama'],
    runtime: 133,
    certification: 'R',
    overview:
      'A struggling family gradually becomes entangled with a wealthy household in an increasingly unpredictable way.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/TU9NIjwzjoKPwQHoHshkBcQ0S.jpg`,
  },
  {
    id: 238,
    title: 'The Godfather',
    year: 1972,
    rating: 8.7,
    voteCount: 21000,
    genres: ['Drama', 'Crime'],
    runtime: 175,
    certification: 'R',
    overview:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg`,
  },
  {
    id: 27205,
    title: 'Inception',
    year: 2010,
    rating: 8.4,
    voteCount: 36000,
    genres: ['Action', 'Science Fiction', 'Adventure'],
    runtime: 148,
    certification: 'PG-13',
    overview:
      'A skilled thief who steals corporate secrets through dream-sharing technology is given a chance to have his past erased.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg`,
  },
];

/* Ready-made collections for static pages. */
export const MOCK_TRENDING_MOVIES = MOCK_MOVIES.slice(0, 6);
export const MOCK_RECOMMENDED_MOVIES = [
  MOCK_MOVIES[4],
  MOCK_MOVIES[7],
  MOCK_MOVIES[2],
  MOCK_MOVIES[5],
  MOCK_MOVIES[3],
];
export const MOCK_POPULAR_MOVIES = [
  MOCK_MOVIES[6],
  MOCK_MOVIES[3],
  MOCK_MOVIES[4],
  MOCK_MOVIES[7],
  MOCK_MOVIES[5],
];

/* -------------------------------------------------------------------------- */
/* Mock user                                                                  */
/* -------------------------------------------------------------------------- */

export const MOCK_USER = {
  id: 'mock-user-001',
  name: 'Alex Morgan',
  email: 'alex@example.com',
  image: null,
} as const;

export const MOCK_USER_STATS: UserStats = {
  moviesRated: 47,
  moviesWatched: 128,
  watchlistCount: 23,
  favoriteCount: 16,
};

export const MOCK_WATCHLIST: MovieListItem[] = [
  MOCK_MOVIES[0],
  MOCK_MOVIES[6],
  MOCK_MOVIES[2],
  MOCK_MOVIES[7],
];

export const MOCK_FAVORITES: MovieListItem[] = [
  MOCK_MOVIES[3],
  MOCK_MOVIES[4],
  MOCK_MOVIES[5],
];

/* -------------------------------------------------------------------------- */
/* Mock activity                                                              */
/* -------------------------------------------------------------------------- */

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'activity-001',
    type: 'rating',
    movie: MOCK_MOVIES[0],
    value: 9,
    createdAt: '2 hours ago',
  },
  {
    id: 'activity-002',
    type: 'favorite',
    movie: MOCK_MOVIES[3],
    createdAt: 'Yesterday',
  },
  {
    id: 'activity-003',
    type: 'watchlist',
    movie: MOCK_MOVIES[6],
    createdAt: '2 days ago',
  },
  {
    id: 'activity-004',
    type: 'rating',
    movie: MOCK_MOVIES[4],
    value: 10,
    createdAt: '4 days ago',
  },
];

/* -------------------------------------------------------------------------- */
/* Discover / filters                                                         */
/* -------------------------------------------------------------------------- */

export const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
] as const;

export const DISCOVER_SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Highest rated', value: 'rating' },
  { label: 'Newest', value: 'release-date' },
  { label: 'Most voted', value: 'votes' },
] as const;

/* -------------------------------------------------------------------------- */
/* Ratings                                                                    */
/* -------------------------------------------------------------------------- */

export const RATING_SCALE = {
  min: 1,
  max: 10,
  step: 0.5,
} as const;

export const RATING_LABELS = {
  1: 'Terrible',
  2: 'Very bad',
  3: 'Bad',
  4: 'Below average',
  5: 'Average',
  6: 'Decent',
  7: 'Good',
  8: 'Very good',
  9: 'Excellent',
  10: 'Masterpiece',
} as const;

/* -------------------------------------------------------------------------- */
/* Empty states                                                               */
/* -------------------------------------------------------------------------- */

export const EMPTY_STATES = {
  watchlist: {
    title: 'Your watchlist is empty',
    description:
      "Save movies you want to see later and they'll all be waiting for you here.",
    actionLabel: 'Discover movies',
    actionHref: '/discover',
  },
  favorites: {
    title: 'No favorites yet',
    description:
      'Give your favorite movies a place on your shelf by adding them here.',
    actionLabel: 'Explore movies',
    actionHref: '/discover',
  },
  search: {
    title: 'No movies found',
    description:
      "Try a different title, genre or keyword and we'll look again.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* API configuration                                                          */
/* -------------------------------------------------------------------------- */

export const API_CONFIG = {
  tmdb: {
    imageBaseUrl: TMDB_IMAGE_BASE,
    posterSizes: {
      small: 'w342',
      medium: 'w500',
      large: 'w780',
      original: 'original',
    },
    backdropSizes: {
      small: 'w780',
      medium: 'w1280',
      large: 'w1920',
      original: 'original',
    },
  },
} as const;
