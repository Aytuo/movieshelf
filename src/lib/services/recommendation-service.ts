import { db } from '@/lib/db';
import { media, mediaInteraction } from '@/lib/db/schema';
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
import type { MediaRecommendation } from '@/types';
import type { InferSelectModel } from 'drizzle-orm';
import { and, desc, eq } from 'drizzle-orm';

type DbMedia = InferSelectModel<typeof media>;

export async function getRecommendationsForUser(
  userId: string,
  type: MediaType
): Promise<MediaRecommendation[]> {
  const shelf = await db
    .select({
      media,
      interaction: mediaInteraction,
    })
    .from(mediaInteraction)
    .innerJoin(media, eq(media.id, mediaInteraction.mediaId))
    .where(and(eq(mediaInteraction.userId, userId), eq(media.type, type)))
    .orderBy(desc(mediaInteraction.updatedAt));

  // Known media: Only media of the requested type are loaded above, so Movie recommendations never see TV entries and vice versa.

  const knownMediaKeys = new Set(shelf.map(({ media }) => getMediaKey(media)));

  // Rated media.

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

  // Seeds: Only strongly-rated media are used recommendation sources.

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

function toRecommendationMedia(media: DbMedia): Media {
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
