const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function tmdbImage(
  path: string | null,
  size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original'
) {
  if (!path) {
    return null;
  }

  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
