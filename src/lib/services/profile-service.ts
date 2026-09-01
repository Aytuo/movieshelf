import {
  createProfile,
  getProfileByUserId,
  getProfileByUsername,
  getUserReviews,
  getUserShelf,
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

  const [shelf, reviews, taste] = await Promise.all([
    getUserShelf(profile.userId),
    getUserReviews(profile.userId),
    getTasteProfile(profile.userId),
  ]);

  const favorites = shelf.filter(({ interaction }) => interaction.favorite);
  const movieShelf = shelf.filter(({ media }) => media.type === 'movie');
  const tvShelf = shelf.filter(({ media }) => media.type === 'tv');

  return {
    profile,

    stats: {
      movies: {
        total: taste.movie.total,
        watched: taste.movie.watched,
        rated: taste.movie.rated,
        favorites: movieShelf.filter(({ interaction }) => interaction.favorite)
          .length,
        averageRating: taste.movie.averageRating,
      },

      tv: {
        total: taste.tv.total,
        watched: taste.tv.watched,
        rated: taste.tv.rated,
        favorites: tvShelf.filter(({ interaction }) => interaction.favorite)
          .length,
        averageRating: taste.tv.averageRating,
      },
    },

    favorites: favorites.slice(0, 6),

    taste,

    reviews: reviews.slice(0, 6),
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
