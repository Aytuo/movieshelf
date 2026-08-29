import type { MediaKey } from '@/lib/media';
import type { MediaRecommendation } from '@/types';

export function excludeKnownMedia(
  recommendations: MediaRecommendation[],
  knownMediaKeys: Set<string>
) {
  return recommendations.filter(
    ({ media }) => !knownMediaKeys.has(getMediaKey(media))
  );
}

export function getMediaKey(media: MediaKey) {
  return `${media.type}:${media.tmdbId}`;
}
