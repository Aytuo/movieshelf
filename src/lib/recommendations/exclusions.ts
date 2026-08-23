export function excludeKnownMovies(
  recommendations: MovieRecommendation[],
  knownMovieIds: Set<number>
) {
  return recommendations.filter(({ movie }) => !knownMovieIds.has(movie.id));
}
