import type { MediaType } from '@/lib/media';
import { tmdbMovieRepository, tmdbTvRepository } from '@/lib/repositories';
import type { MediaRecommendation } from '@/types';

export async function getColdStartRecommendations(
  type: MediaType
): Promise<MediaRecommendation[]> {
  const repository = type === 'movie' ? tmdbMovieRepository : tmdbTvRepository;

  const media = await repository.getPopular();

  return media
    .filter((item) => item.type === type)
    .slice(0, 12)
    .map((item): MediaRecommendation => ({
      media: item,
      score: 0,
      reason:
        type === 'movie'
          ? 'Popular on MovieShelf'
          : 'Popular TV series on MovieShelf',
      reasonType: 'explore',
    }));
}
