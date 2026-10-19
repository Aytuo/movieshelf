import type { Media, MediaType } from '@/lib/media';
import {
  completeOnboarding as completeOnboardingRecord,
  tmdbMovieRepository,
  tmdbTvRepository,
} from '@/lib/repositories';

export async function getOnboardingCandidates(
  type: MediaType
): Promise<Media[]> {
  const repository = type === 'movie' ? tmdbMovieRepository : tmdbTvRepository;

  const [popular, trending] = await Promise.all([
    repository.getPopular(),
    repository.getTrending(),
  ]);

  const uniqueMedia = new Map<string, Media>();

  for (const item of [...popular, ...trending]) {
    if (item.type !== type) {
      continue;
    }

    const key = `${item.type}:${item.tmdbId}`;

    if (!uniqueMedia.has(key)) {
      uniqueMedia.set(key, item);
    }
  }

  return Array.from(uniqueMedia.values()).slice(0, 24);
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
