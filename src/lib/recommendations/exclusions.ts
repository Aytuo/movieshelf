import { MediaRecommendation } from '@/types';

export function excludeKnownMovies(
  recommendations: MediaRecommendation[],
  knownMediaIds: Set<number>
) {
  return recommendations.filter(
    ({ media }) => !knownMediaIds.has(media.tmdbId)
  );
}
