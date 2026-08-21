import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function getPosterUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' = 'w500'
) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280'
) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http')) {
    return path;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
