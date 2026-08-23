import type { RecommendationCandidate } from './candidate-generator';

type RatedMovie = {
  movie: Movie;
  rating: number;
};

type TasteSignals = {
  genreAffinity: Map<string, number>;
  decadeAffinity: Map<string, number>;
  averageRating: number | null;
};

export function buildTasteSignals(ratedMovies: RatedMovie[]): TasteSignals {
  const genreSums = new Map<string, { total: number; count: number }>();

  const decadeSums = new Map<string, { total: number; count: number }>();

  let ratingTotal = 0;

  for (const { movie, rating } of ratedMovies) {
    ratingTotal += rating;

    for (const genre of movie.genres) {
      const current = genreSums.get(genre) ?? {
        total: 0,
        count: 0,
      };

      current.total += rating;
      current.count += 1;

      genreSums.set(genre, current);
    }

    const decade = getDecade(movie.releaseDate);

    if (decade) {
      const current = decadeSums.get(decade) ?? {
        total: 0,
        count: 0,
      };

      current.total += rating;
      current.count += 1;

      decadeSums.set(decade, current);
    }
  }

  const genreAffinity = new Map<string, number>();

  for (const [genre, value] of genreSums) {
    genreAffinity.set(genre, value.total / value.count / 10);
  }

  const decadeAffinity = new Map<string, number>();

  for (const [decade, value] of decadeSums) {
    decadeAffinity.set(decade, value.total / value.count / 10);
  }

  return {
    genreAffinity,
    decadeAffinity,

    averageRating:
      ratedMovies.length > 0 ? ratingTotal / ratedMovies.length : null,
  };
}

export function scoreCandidate({
  candidate,
  signals,
  sourceMovieTitle,
}: {
  candidate: RecommendationCandidate;
  signals: TasteSignals;
  sourceMovieTitle?: string;
}): MovieRecommendation {
  const movie = candidate.movie;

  /* ------------------------------------------------------------------------ */
  /* Genre affinity — 30%                                                     */
  /* ------------------------------------------------------------------------ */

  const genreScores = movie.genres
    .map((genre) => signals.genreAffinity.get(genre) ?? 0)
    .filter((value) => value > 0);

  const genreScore =
    genreScores.length > 0
      ? genreScores.reduce((sum, value) => sum + value, 0) / genreScores.length
      : 0;

  /* ------------------------------------------------------------------------ */
  /* Similarity — 30%                                                         */
  /* ------------------------------------------------------------------------ */

  const similarityScore = Math.min(candidate.similarityScore, 1);

  /* ------------------------------------------------------------------------ */
  /* Decade affinity — 10%                                                    */
  /* ------------------------------------------------------------------------ */

  const decade = getDecade(movie.releaseDate);

  const decadeScore = decade ? (signals.decadeAffinity.get(decade) ?? 0) : 0;

  /* ------------------------------------------------------------------------ */
  /* TMDB quality — 10%                                                       */
  /* ------------------------------------------------------------------------ */

  const ratingScore = Math.min(movie.rating / 10, 1);

  const voteConfidence = Math.min(movie.voteCount / 5000, 1);

  const qualityScore = ratingScore * 0.7 + voteConfidence * 0.3;

  /* ------------------------------------------------------------------------ */
  /* Popularity / vote signal — 5%                                            */
  /* ------------------------------------------------------------------------ */

  const popularityScore = 1 - Math.exp(-movie.voteCount / 2500);

  /* ------------------------------------------------------------------------ */
  /* Exploration — 15%                                                        */
  /* ------------------------------------------------------------------------ */

  const explorationScore = genreScore < 0.35 ? 1 : 0.35;

  const score =
    genreScore * 0.3 +
    similarityScore * 0.3 +
    decadeScore * 0.1 +
    qualityScore * 0.1 +
    popularityScore * 0.05 +
    explorationScore * 0.15;

  const normalizedScore = Math.round(score * 100);

  const reason = getReason({
    movie,
    genreScore,
    similarityScore,
    decadeScore,
    sourceMovieTitle,
  });

  const reasonType =
    similarityScore >= 0.65
      ? 'because-you-liked'
      : genreScore >= 0.65
        ? 'matches-your-taste'
        : 'explore';

  return {
    movie,
    score: normalizedScore,
    reason,
    reasonType,
  };
}

function getReason({
  movie,
  genreScore,
  similarityScore,
  decadeScore,
  sourceMovieTitle,
}: {
  movie: Movie;
  genreScore: number;
  similarityScore: number;
  decadeScore: number;
  sourceMovieTitle?: string;
}) {
  if (sourceMovieTitle && similarityScore >= 0.7) {
    return `Because you liked ${sourceMovieTitle}`;
  }

  if (genreScore >= 0.65 && movie.genres.length > 0) {
    return `${movie.genres[0]} matches your taste`;
  }

  if (decadeScore >= 0.7) {
    return 'From one of your favorite eras';
  }

  return 'Something a little different';
}

function getDecade(releaseDate: string | null) {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  if (!Number.isFinite(year)) {
    return null;
  }

  return `${Math.floor(year / 10) * 10}s`;
}
