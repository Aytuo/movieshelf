import type { MediaRecommendation } from '@/types';

export function diversifyRecommendations(
  recommendations: MediaRecommendation[],
  limit = 12
) {
  const selected: MediaRecommendation[] = [];

  const genreCounts = new Map<number, number>();

  const remaining = [...recommendations].sort((a, b) => b.score - a.score);

  while (selected.length < limit && remaining.length > 0) {
    let selectedIndex = 0;

    for (let index = 0; index < remaining.length; index++) {
      const candidate = remaining[index];

      const primaryGenre = candidate.media.genres[0];

      if (!primaryGenre) {
        selectedIndex = index;
        break;
      }

      const currentCount = genreCounts.get(primaryGenre.id) ?? 0;

      if (currentCount < 3) {
        selectedIndex = index;
        break;
      }
    }

    const [candidate] = remaining.splice(selectedIndex, 1);

    selected.push(candidate);

    const primaryGenre = candidate.media.genres[0];

    if (primaryGenre) {
      genreCounts.set(
        primaryGenre.id,
        (genreCounts.get(primaryGenre.id) ?? 0) + 1
      );
    }
  }

  return selected;
}
