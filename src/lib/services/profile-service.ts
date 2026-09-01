import {
  createProfile,
  getProfileByUserId,
  getProfileByUsername,
  getPublicMediaStats,
  getUserFavorites,
  getUserReviews,
  usernameExists,
} from '@/lib/repositories';
import { getTasteProfile } from '@/lib/services/taste-service';
import { getUserMediaActivity } from './media-activity-service';

const USERNAME_MAX_LENGTH = 14;
const RANDOM_SUFFIX_LENGTH = 4;
const MAX_USERNAME_GENERATION_ATTEMPTS = 5;

function createBaseUsername(name: string | null | undefined, email: string) {
  const fromName = name
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 14);

  if (fromName) {
    return fromName;
  }

  const fromEmail = email
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 14);

  return fromEmail || 'moviefan';
}

function createEmptyMediaStats() {
  return {
    total: 0,
    watched: 0,
    rated: 0,
    favorites: 0,
    averageRating: null,
  };
}

function mapPublicMediaStats(
  rows: Awaited<ReturnType<typeof getPublicMediaStats>>
) {
  const movie = rows.find((row) => row.type === 'movie') ?? {
    type: 'movie' as const,
    ...createEmptyMediaStats(),
  };

  const tv = rows.find((row) => row.type === 'tv') ?? {
    type: 'tv' as const,
    ...createEmptyMediaStats(),
  };

  return {
    movies: {
      total: Number(movie.total),
      watched: Number(movie.watched),
      rated: Number(movie.rated),
      favorites: Number(movie.favorites),
      averageRating:
        movie.averageRating === null ? null : Number(movie.averageRating),
    },
    tv: {
      total: Number(tv.total),
      watched: Number(tv.watched),
      rated: Number(tv.rated),
      favorites: Number(tv.favorites),
      averageRating:
        tv.averageRating === null ? null : Number(tv.averageRating),
    },
  };
}

async function generateUniqueUsername(base: string) {
  let username = base;

  for (let attempt = 0; attempt < MAX_USERNAME_GENERATION_ATTEMPTS; attempt++) {
    const exists = await usernameExists(username);

    if (!exists) {
      return username;
    }

    const suffix = Math.floor(1000 + Math.random() * 9000);

    username = `${base.slice(
      0,
      USERNAME_MAX_LENGTH - RANDOM_SUFFIX_LENGTH - 1
    )}_${suffix}`;
  }

  throw new Error('Unable to generate a unique username.');
}

export async function isUsernameAvailable(
  username: string,
  currentUserId: string
) {
  const existing = await getProfileByUsername(username);

  return !existing || existing.userId === currentUserId;
}

export async function ensureProfile({
  userId,
  name,
  email,
}: {
  userId: string;
  name: string | null | undefined;
  email: string;
}) {
  const existing = await getProfileByUserId(userId);

  if (existing) {
    return existing;
  }

  const baseUsername = createBaseUsername(name, email);
  const username = await generateUniqueUsername(baseUsername);

  return createProfile({
    userId,
    username,
    displayName: name ?? null,
  });
}

export async function getPublicProfile(username: string) {
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return null;
  }

  const [mediaStats, favorites] = await Promise.all([
    getPublicMediaStats(profile.userId),
    getUserFavorites(profile.userId, 6),
  ]);

  return {
    profile,
    stats: mapPublicMediaStats(mediaStats),
    favorites,
  };
}

export async function getPublicTaste(username: string) {
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return null;
  }

  const taste = await getTasteProfile(profile.userId);

  return {
    profile,
    taste,
  };
}

export async function getPublicReviews(username: string) {
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return null;
  }

  const reviews = await getUserReviews(profile.userId);

  return {
    profile,
    reviews,
  };
}

export async function getPublicActivity(username: string) {
  const profile = await getProfileByUsername(username);

  if (!profile) {
    return null;
  }

  const activities = await getUserMediaActivity(profile.userId);

  return {
    profile,
    activities,
  };
}
