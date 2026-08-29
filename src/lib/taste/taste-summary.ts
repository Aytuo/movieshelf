import type { MediaType } from '@/lib/media';
import type { TasteStats } from '@/types';

export function getTasteSummary(taste: TasteStats, type: MediaType) {
  if (taste.watched === 0) {
    return {
      title:
        type === 'movie'
          ? 'Your movie taste is just beginning.'
          : 'Your TV taste is just beginning.',
      description:
        type === 'movie'
          ? 'Start watching and rating movies and MovieShelf will gradually learn what makes a film feel like yours.'
          : 'Start watching and rating TV series and MovieShelf will gradually learn what makes a series feel like yours.',
    };
  }

  const topGenre = taste.topGenres[0]?.name;
  const topDecade = taste.favoriteDecades[0]?.decade;

  if (topGenre && topDecade && taste.averageRating !== null) {
    const genre = topGenre.toLowerCase();

    return {
      title:
        type === 'movie'
          ? `You have a soft spot for ${genre}.`
          : `You have a soft spot for ${genre} series.`,
      description:
        type === 'movie'
          ? `Your movie shelf leans toward ${genre} and you seem especially drawn to movies from the ${topDecade}. Your current average rating is ${taste.averageRating}/10.`
          : `Your TV shelf leans toward ${genre} and you seem especially drawn to series from the ${topDecade}. Your current average rating is ${taste.averageRating}/10.`,
    };
  }

  return {
    title:
      type === 'movie'
        ? 'Your movie taste is taking shape.'
        : 'Your TV taste is taking shape.',
    description:
      type === 'movie'
        ? 'Keep watching and rating movies to build a clearer picture of what you love.'
        : 'Keep watching and rating TV series to build a clearer picture of what you love.',
  };
}
