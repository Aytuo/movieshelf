/**
 * MovieShelf — constants & mock data
 *
 * Keep UI-ready static data here while the application is being built without
 * the TMDB/API layer. When the API is connected, components can keep consuming
 * the same data shapes and replace these sources with real responses.
 */

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
    originalTitle: 'Oppenheimer',
    overview:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    tagline: 'The world forever changes.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg`,
    releaseDate: '2023-07-21',
    runtime: 180,
    genres: ['Drama', 'History'],
    rating: 8.1,
    voteCount: 9000,
    certification: 'R',
  },
  {
    id: 693134,
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    tagline: 'Long live the fighters.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg`,
    releaseDate: '2024-03-01',
    runtime: 166,
    genres: ['Science Fiction', 'Adventure', 'Drama'],
    rating: 8.6,
    voteCount: 12000,
  },
  {
    id: 569094,
    title: 'Spider-Man: Across the Spider-Verse',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    overview:
      'Miles Morales catapults across the Multiverse and encounters a team of Spider-People charged with protecting its very existence.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg`,
    releaseDate: '2023-06-02',
    runtime: 140,
    genres: ['Animation', 'Action', 'Adventure'],
    rating: 8.3,
    voteCount: 7000,
    certification: 'PG',
  },
  {
    id: 155,
    title: 'The Dark Knight',
    originalTitle: 'The Dark Knight',
    overview:
      'Batman faces a criminal mastermind whose reign of chaos pushes Gotham and its heroes to their limits.',
    tagline: 'Why so serious?',
    posterPath: `${TMDB_IMAGE_BASE}/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg`,
    releaseDate: '2008-07-16',
    runtime: 152,
    genres: ['Drama', 'Action', 'Crime', 'Thriller'],
    rating: 9.0,
    voteCount: 33000,
    certification: 'PG-13',
  },
  {
    id: 157336,
    title: 'Interstellar',
    originalTitle: 'Interstellar',
    overview:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/xJHokMbljvjADYdit5fK5cNTXkd.jpg`,
    releaseDate: '2014-11-07',
    runtime: 169,
    genres: ['Adventure', 'Drama', 'Science Fiction'],
    rating: 8.7,
    voteCount: 35000,
    certification: 'PG-13',
  },
  {
    id: 496243,
    title: 'Parasite',
    originalTitle: 'Parasite',
    overview:
      'A struggling family gradually becomes entangled with a wealthy household in an increasingly unpredictable way.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/TU9NIjwzjoKPwQHoHshkBcQ0S.jpg`,
    releaseDate: '2019-05-30',
    runtime: 133,
    genres: ['Comedy', 'Thriller', 'Drama'],
    rating: 8.5,
    voteCount: 19000,
    certification: 'R',
  },
  {
    id: 238,
    title: 'The Godfather',
    originalTitle: 'The Godfather',
    overview:
      'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    tagline: "An offer you can't refuse.",
    posterPath: `${TMDB_IMAGE_BASE}/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg`,
    releaseDate: '1972-03-14',
    runtime: 175,
    genres: ['Drama', 'Crime'],
    rating: 9.2,
    voteCount: 20000,
    certification: 'R',
  },
  {
    id: 27205,
    title: 'Inception',
    originalTitle: 'Inception',
    overview:
      'A skilled thief who steals secrets through dream-sharing technology is given a chance to erase his past by performing an impossible task.',
    tagline: 'Your mind is the scene of the crime.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg`,
    releaseDate: '2010-07-15',
    runtime: 148,
    genres: ['Action', 'Science Fiction', 'Adventure'],
    rating: 8.8,
    voteCount: 35000,
    certification: 'PG-13',
  },
  {
    id: 550,
    title: 'Fight Club',
    originalTitle: 'Fight Club',
    overview:
      'An insomniac office worker and a mysterious soap maker form an underground fight club that evolves into something far more dangerous.',
    tagline: 'Mischief. Mayhem. Soap.',
    posterPath: `${TMDB_IMAGE_BASE}/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg`,
    backdropPath: `${TMDB_IMAGE_BASE}/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg`,
    releaseDate: '1999-10-15',
    runtime: 139,
    genres: ['Drama'],
    rating: 8.8,
    voteCount: 28000,
    certification: 'R',
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
export const MOCK_RECENTLY_ADDED_MOVIES = [
  MOCK_MOVIES[1],
  MOCK_MOVIES[3],
  MOCK_MOVIES[5],
  MOCK_MOVIES[7],
  MOCK_MOVIES[2],
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
/* Genres                                                        */
/* -------------------------------------------------------------------------- */

export const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
] as const;

/* -------------------------------------------------------------------------- */
/* Discover / filters                                                         */
/* -------------------------------------------------------------------------- */

export const DISCOVER_SORT_OPTIONS = [
  {
    value: 'popularity.desc',
    label: 'Most popular',
  },
  {
    value: 'vote_average.desc',
    label: 'Highest rated',
  },
  {
    value: 'primary_release_date.desc',
    label: 'Newest',
  },
  {
    value: 'primary_release_date.asc',
    label: 'Oldest',
  },
  {
    value: 'vote_count.desc',
    label: 'Most rated',
  },
] as const;

// export const DISCOVER_SORT_OPTIONS = [
//   { label: 'Popularity', value: 'popularity' },
//   { label: 'Highest rated', value: 'rating' },
//   { label: 'Newest', value: 'release-date' },
//   { label: 'Most voted', value: 'votes' },
// ] as const;

export const LANGUAGE_OPTIONS = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'pl',
    label: 'Polish',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'de',
    label: 'German',
  },
  {
    value: 'es',
    label: 'Spanish',
  },
  {
    value: 'ja',
    label: 'Japanese',
  },
  {
    value: 'ko',
    label: 'Korean',
  },
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
