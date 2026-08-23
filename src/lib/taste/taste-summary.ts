export function getTasteSummary(taste: TasteProfile) {
  if (taste.watchedMovies === 0) {
    return {
      title: 'Your taste is just beginning.',
      description:
        'Start rating movies and MovieShelf will gradually learn what makes a film feel like yours.',
    };
  }

  const topGenre = taste.topGenres[0]?.name;

  const topDecade = taste.favoriteDecades[0]?.decade;

  if (topGenre && topDecade && taste.averageRating !== null) {
    return {
      title: `You have a soft spot for ${topGenre}.`,
      description: `Your shelf leans toward ${topGenre.toLowerCase()} and you seem especially drawn to movies from the ${topDecade}. Your current average rating is ${taste.averageRating}/10.`,
    };
  }

  return {
    title: 'Your taste is taking shape.',
    description:
      'Keep watching and rating movies to build a clearer picture of what you love.',
  };
}
