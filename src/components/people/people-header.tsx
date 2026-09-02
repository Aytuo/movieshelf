import { tmdbImage } from '@/lib/tmdb/images';
import type { Person } from '@/types';
import PersonBiography from './person-biography';

type PersonHeaderProps = {
  person: Person;
};

function formatDate(date: string | null) {
  if (!date) {
    return null;
  }

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

const PersonHeader = ({ person }: PersonHeaderProps) => {
  const portrait = tmdbImage(person.profilePath, 'w500');

  const birthday = formatDate(person.birthday);
  const deathday = formatDate(person.deathday);

  return (
    <section className="border-b border-border/60">
      <div className="container-content py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <div className="mx-auto w-full max-w-[220px]">
            <div className="overflow-hidden rounded-2xl bg-surface shadow-sm">
              {portrait ? (
                <img
                  src={portrait}
                  alt={`${person.name} portrait`}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="aspect-[2/3] bg-surface-hover" />
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {person.knownForDepartment && (
                <span>{person.knownForDepartment}</span>
              )}

              {birthday && (
                <>
                  <span aria-hidden>•</span>
                  <span>{birthday}</span>
                </>
              )}

              {deathday && (
                <>
                  <span aria-hidden>•</span>
                  <span>{deathday}</span>
                </>
              )}
            </div>

            <h1 className="mt-3 max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {person.name}
            </h1>

            {person.placeOfBirth && (
              <p className="mt-3 text-sm text-muted-foreground">
                {person.placeOfBirth}
              </p>
            )}

            {person.biography && (
              <div className="mt-7 max-w-3xl">
                <PersonBiography biography={person.biography} />
              </div>
            )}

            {(person.imdbId || person.homepage) && (
              <div className="mt-7 flex flex-wrap gap-2">
                {person.imdbId && (
                  <a
                    href={`https://www.imdb.com/name/${person.imdbId}/`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-hover"
                  >
                    IMDb
                  </a>
                )}

                {person.homepage && (
                  <a
                    href={person.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-hover"
                  >
                    Official website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonHeader;
