import type { Media, MediaType } from '@/lib/media';
import {
  generateCandidates,
  type RecommendationSeed,
} from '@/lib/recommendations/candidate-generator';
import { diversifyRecommendations } from '@/lib/recommendations/diversify';
import {
  excludeKnownMedia,
  getMediaKey,
} from '@/lib/recommendations/exclusions';
import {
  buildTasteSignals,
  scoreCandidate,
} from '@/lib/recommendations/scorer';
import { getUserShelfForType } from '@/lib/repositories/media-interaction-repository';
import type { MediaRecommendation } from '@/types';

type RecommendationShelfItem = Awaited<
  ReturnType<typeof getUserShelfForType>
>[number];

export async function getRecommendationsForUser(
  userId: string,
  type: MediaType
): Promise<MediaRecommendation[]> {
  const shelf = await getUserShelfForType(userId, type);

  // Known media: Only media of the requested type are loaded by the repository.

  const knownMediaKeys = new Set(shelf.map(({ media }) => getMediaKey(media)));

  //  Rated media.

  const ratedMedia = shelf
    .filter(({ interaction }) => interaction.rating !== null)
    .map(({ media, interaction }) => ({
      media: toRecommendationMedia(media),
      rating: interaction.rating!,
    }))
    .sort((a, b) => b.rating - a.rating);

  // Cold start.

  if (ratedMedia.length < 3) {
    return [];
  }

  // Seeds: Only strongly-rated media are used as recommendation sources.

  const seeds: RecommendationSeed[] = ratedMedia
    .filter(({ rating }) => rating >= 8)
    .slice(0, 3)
    .map(({ media, rating }) => ({
      tmdbId: media.tmdbId,
      type: media.type,
      rating,
    }));

  if (seeds.length === 0) {
    return [];
  }

  // Taste signals.

  const signals = buildTasteSignals(ratedMedia);

  // Candidate generation.

  const candidates = await generateCandidates(seeds);

  // Source media titles.

  const seedTitles = new Map<string, string>();

  for (const seed of seeds) {
    const rated = ratedMedia.find(
      ({ media }) => media.tmdbId === seed.tmdbId && media.type === seed.type
    );

    if (rated) {
      seedTitles.set(getMediaKey(seed), rated.media.title);
    }
  }

  // Scoring.

  const scored = candidates.map((candidate) =>
    scoreCandidate({
      candidate,
      signals,
      sourceMediaTitle: candidate.sourceMediaKey
        ? seedTitles.get(getMediaKey(candidate.sourceMediaKey))
        : undefined,
    })
  );

  // Exclusions.

  const filtered = excludeKnownMedia(scored, knownMediaKeys);

  // Diversification.

  return diversifyRecommendations(filtered, 12);
}

function toRecommendationMedia(media: RecommendationShelfItem['media']): Media {
  return {
    tmdbId: media.tmdbId,
    type: media.type,
    title: media.title,
    originalTitle: media.originalTitle,
    overview: media.overview,
    posterPath: media.posterPath,
    backdropPath: media.backdropPath,
    releaseDate: media.releaseDate,
    rating: Number(media.tmdbRating ?? 0),
    voteCount: media.tmdbVoteCount,
    originalLanguage: media.originalLanguage,
    genres: media.genres,
  };
}
