import { tmdbMovieRepository } from '@/lib/repositories';
import type { MediaRecommendation } from '@/types';

export async function getColdStartRecommendations(): Promise<
  MediaRecommendation[]
> {
  const media = await tmdbMovieRepository.getPopular();

  return media.slice(0, 12).map((item): MediaRecommendation => ({
    media: item,
    score: 0,
    reason: 'Popular on MovieShelf',
    reasonType: 'explore',
  }));
}
