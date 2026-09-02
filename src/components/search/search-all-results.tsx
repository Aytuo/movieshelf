import type { SearchAllItem } from '@/types';
import MediaSearchResults from './media-search-results';
import PeopleSearchResults from './people-search-results';

type SearchAllResultsProps = {
  results: SearchAllItem[];
};

const SearchAllResults = ({ results }: SearchAllResultsProps) => {
  const media = results
    .filter(
      (item): item is Extract<SearchAllItem, { type: 'media' }> =>
        item.type === 'media'
    )
    .map((item) => item.media);

  const people = results
    .filter(
      (item): item is Extract<SearchAllItem, { type: 'person' }> =>
        item.type === 'person'
    )
    .map((item) => item.person);

  return (
    <div className="space-y-12">
      {media.length > 0 && (
        <section>
          <h3 className="mb-5 font-heading text-xl font-bold tracking-tight">
            Movies & TV
          </h3>

          <MediaSearchResults media={media} />
        </section>
      )}

      {people.length > 0 && (
        <section>
          <h3 className="mb-5 font-heading text-xl font-bold tracking-tight">
            People
          </h3>

          <PeopleSearchResults people={people} />
        </section>
      )}
    </div>
  );
};

export default SearchAllResults;
