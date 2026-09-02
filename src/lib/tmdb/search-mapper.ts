import type { Media } from '@/lib/media';
import type { PersonSearchItem } from '@/types';
import { mapTmdbMovie, mapTmdbTv } from './media-mapper';
import { mapTmdbPersonSearchItem } from './people-mapper';
import type { TmdbMultiSearchResult } from './types';

export type MappedMultiSearchResult =
  | {
      type: 'media';
      data: Media;
    }
  | {
      type: 'person';
      data: PersonSearchItem;
    };

export function mapTmdbMultiSearchResult(
  result: TmdbMultiSearchResult
): MappedMultiSearchResult {
  switch (result.media_type) {
    case 'movie':
      return {
        type: 'media',
        data: mapTmdbMovie(result),
      };

    case 'tv':
      return {
        type: 'media',
        data: mapTmdbTv(result),
      };

    case 'person':
      return {
        type: 'person',
        data: mapTmdbPersonSearchItem(result),
      };
  }
}
