import { tmdbImage } from '@/lib/tmdb/images';
import type { PersonSearchItem } from '@/types';
import Link from 'next/link';

type PeopleSearchResultsProps = {
  people: PersonSearchItem[];
};

const PeopleSearchResults = ({ people }: PeopleSearchResultsProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => {
        const portrait = tmdbImage(person.profilePath, 'w185');

        return (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group flex items-center gap-4 rounded-2xl p-4 transition-transform duration-200 surface hover:-translate-y-0.5"
          >
            <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-surface-hover">
              {portrait ? (
                <img
                  src={portrait}
                  alt={`${person.name} portrait`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                {person.name}
              </h3>

              {person.knownForDepartment && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {person.knownForDepartment}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PeopleSearchResults;
