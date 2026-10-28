import type { Media, MediaType } from '@/lib/media';
import {
  completeOnboarding as completeOnboardingRecord,
  tmdbMovieRepository,
  tmdbTvRepository,
} from '@/lib/repositories';
import type { MediaSearchResult } from '@/types';

export async function getOnboardingCandidates(
  type: MediaType
): Promise<Media[]> {
  const result = await getOnboardingMediaPage(type);

  return result.media;
}

export async function getOnboardingMediaPage(
  type: MediaType,
  options: {
    query?: string;
    page?: number;
  } = {}
): Promise<MediaSearchResult> {
  const page = options.page ?? 1;
  const query = options.query?.trim();

  if (query) {
    return type === 'movie'
      ? tmdbMovieRepository.search(query, { page })
      : tmdbTvRepository.search(query, { page });
  }

  const result =
    type === 'movie'
      ? await tmdbMovieRepository.discover({
          type: 'movie',
          page,
          sortBy: 'popularity.desc',
        })
      : await tmdbTvRepository.discover({
          type: 'tv',
          page,
          sortBy: 'popularity.desc',
        });

  return {
    media: result.media,
    page: result.page,
    totalPages: result.totalPages,
    totalResults: result.totalResults,
  };
}

export async function completeTasteOnboarding(userId: string) {
  const profile = await completeOnboardingRecord(userId);

  if (!profile) {
    throw new Error(
      'Cannot complete onboarding because the profile does not exist.'
    );
  }

  return profile;
}
