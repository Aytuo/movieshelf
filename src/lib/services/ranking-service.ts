import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';
import type { Ranking, RankingItem, RankingType } from '@/types';
import { withStoredMediaRatings } from './media-rating-service';

const RANKING_LIMIT = 100;
const MIN_VOTE_COUNT = 10_000;

function calculateWeightedRating(
  rating: number,
  voteCount: number,
  meanRating: number
) {
  return (
    (voteCount / (voteCount + MIN_VOTE_COUNT)) * rating +
    (MIN_VOTE_COUNT / (voteCount + MIN_VOTE_COUNT)) * meanRating
  );
}

function buildRanking(
  type: RankingType,
  media: RankingItem['media'][]
): Ranking {
  if (media.length === 0) {
    return {
      type,
      items: [],
      generatedAt: new Date(),
    };
  }

  const meanRating =
    media.reduce((sum, item) => sum + item.rating, 0) / media.length;

  const ranked = media
    .map((media) => ({
      media,
      score: calculateWeightedRating(media.rating, media.voteCount, meanRating),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      if (b.media.rating !== a.media.rating) {
        return b.media.rating - a.media.rating;
      }

      if (b.media.voteCount !== a.media.voteCount) {
        return b.media.voteCount - a.media.voteCount;
      }

      return a.media.tmdbId - b.media.tmdbId;
    })
    .slice(0, RANKING_LIMIT);

  return {
    type,
    items: ranked.map((item, index) => ({
      rank: index + 1,
      media: item.media,
      score: item.score,
    })),
    generatedAt: new Date(),
  };
}

async function applyStoredRatingsToRanking(ranking: Ranking): Promise<Ranking> {
  const ratedMedia = await withStoredMediaRatings(
    ranking.items.map((item) => item.media)
  );

  return {
    ...ranking,
    items: ranking.items.map((item, index) => ({
      ...item,
      media: ratedMedia[index] ?? item.media,
    })),
  };
}

export async function getMovieRanking() {
  const candidates = await tmdbMovieRepository.getRankingCandidates();

  return applyStoredRatingsToRanking(buildRanking('movie', candidates));
}

export async function getTvRanking() {
  const candidates = await tmdbTvRepository.getRankingCandidates();

  return applyStoredRatingsToRanking(buildRanking('tv', candidates));
}
