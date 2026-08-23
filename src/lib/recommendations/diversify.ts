export function diversifyRecommendations(
  recommendations: MovieRecommendation[],
  limit = 12
) {
  const selected: MovieRecommendation[] = [];

  const genreCounts = new Map<string, number>();

  const remaining = [...recommendations].sort((a, b) => b.score - a.score);

  while (selected.length < limit && remaining.length > 0) {
    let selectedIndex = 0;

    for (let index = 0; index < remaining.length; index++) {
      const candidate = remaining[index];

      const primaryGenre = candidate.movie.genres[0] ?? 'unknown';

      const currentCount = genreCounts.get(primaryGenre) ?? 0;

      if (currentCount < 3) {
        selectedIndex = index;
        break;
      }
    }

    const [candidate] = remaining.splice(selectedIndex, 1);

    selected.push(candidate);

    const primaryGenre = candidate.movie.genres[0] ?? 'unknown';

    genreCounts.set(primaryGenre, (genreCounts.get(primaryGenre) ?? 0) + 1);
  }

  return selected;
}
