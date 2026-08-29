import type { MediaRecommendation } from '@/types';
import type { Media } from '../media';
import type { RecommendationCandidate } from './candidate-generator';

export type RatedMedia = {
  media: Media;
  rating: number;
};

export type TasteSignals = {
  genreAffinity: Map<number, number>;
  decadeAffinity: Map<string, number>;
  averageRating: number | null;
};

export function buildTasteSignals(ratedMedia: RatedMedia[]): TasteSignals {
  const genreSums = new Map<number, { total: number; count: number }>();

  const decadeSums = new Map<string, { total: number; count: number }>();

  let ratingTotal = 0;

  for (const { media, rating } of ratedMedia) {
    ratingTotal += rating;

    for (const genre of media.genres) {
      const current = genreSums.get(genre.id) ?? {
        total: 0,
        count: 0,
      };

      current.total += rating;
      current.count += 1;

      genreSums.set(genre.id, current);
    }

    const decade = getDecade(media.releaseDate);

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

  const genreAffinity = new Map<number, number>();

  for (const [genreId, value] of genreSums) {
    genreAffinity.set(genreId, value.total / value.count / 10);
  }

  const decadeAffinity = new Map<string, number>();

  for (const [decade, value] of decadeSums) {
    decadeAffinity.set(decade, value.total / value.count / 10);
  }

  return {
    genreAffinity,
    decadeAffinity,
    averageRating:
      ratedMedia.length > 0 ? ratingTotal / ratedMedia.length : null,
  };
}

export function scoreCandidate({
  candidate,
  signals,
  sourceMediaTitle,
}: {
  candidate: RecommendationCandidate;
  signals: TasteSignals;
  sourceMediaTitle?: string;
}): MediaRecommendation {
  const media = candidate.media;

  /* ------------------------------------------------------------------------ */
  /* Genre affinity — 30%                                                     */
  /* ------------------------------------------------------------------------ */

  const genreScores = media.genres
    .map((genre) => signals.genreAffinity.get(genre.id) ?? 0)
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

  const decade = getDecade(media.releaseDate);

  const decadeScore = decade ? (signals.decadeAffinity.get(decade) ?? 0) : 0;

  /* ------------------------------------------------------------------------ */
  /* TMDB quality — 10%                                                       */
  /* ------------------------------------------------------------------------ */

  const ratingScore = Math.min(media.rating / 10, 1);

  const voteConfidence = Math.min(media.voteCount / 5000, 1);

  const qualityScore = ratingScore * 0.7 + voteConfidence * 0.3;

  /* ------------------------------------------------------------------------ */
  /* Popularity / vote signal — 5%                                            */
  /* ------------------------------------------------------------------------ */

  const popularityScore = 1 - Math.exp(-media.voteCount / 2500);

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
    media,
    genreScore,
    similarityScore,
    decadeScore,
    sourceMediaTitle,
  });

  const reasonType =
    similarityScore >= 0.65
      ? 'because-you-liked'
      : genreScore >= 0.65
        ? 'matches-your-taste'
        : 'explore';

  return {
    media,
    score: normalizedScore,
    reason,
    reasonType,
  };
}

function getReason({
  media,
  genreScore,
  similarityScore,
  decadeScore,
  sourceMediaTitle,
}: {
  media: Media;
  genreScore: number;
  similarityScore: number;
  decadeScore: number;
  sourceMediaTitle?: string;
}) {
  if (sourceMediaTitle && similarityScore >= 0.7) {
    return `Because you liked ${sourceMediaTitle}`;
  }

  if (genreScore >= 0.65 && media.genres.length > 0) {
    return `${media.genres[0].name} matches your taste`;
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
