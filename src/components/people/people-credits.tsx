import { tmdbImage } from '@/lib/tmdb/images';
import type { PersonCredit } from '@/types';
import Link from 'next/link';
import PersonFilmography from './person-filmography';

type PersonCreditsProps = {
  knownFor: PersonCredit[];
  acting: {
    movies: PersonCredit[];
    tv: PersonCredit[];
  };
  directing: PersonCredit[];
  writing: PersonCredit[];
  production: PersonCredit[];
  otherCrew: PersonCredit[];
};

type CreditSectionProps = {
  title: string;
  credits: PersonCredit[];
};

function formatYear(date: string | null) {
  if (!date) {
    return null;
  }

  const year = Number(date.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

function CreditGrid({ credits }: { credits: PersonCredit[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {credits.map((credit) => {
        const poster = tmdbImage(credit.posterPath, 'w342');

        return (
          <Link
            key={`${credit.type}-${credit.tmdbId}-${credit.creditId}`}
            href={`/${credit.type === 'movie' ? 'movie' : 'tv'}/${credit.tmdbId}`}
            className="group overflow-hidden rounded-2xl transition-transform duration-200 surface hover:-translate-y-0.5"
          >
            <div className="aspect-[2/3] overflow-hidden bg-surface-hover">
              {poster ? (
                <img
                  src={poster}
                  alt={`${credit.title} poster`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 font-heading text-sm font-semibold transition-colors group-hover:text-primary">
                {credit.title}
              </h3>

              <div className="mt-1 text-xs text-muted-foreground">
                {formatYear(credit.releaseDate) ?? '—'}
              </div>

              {credit.character && (
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {credit.character}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function CreditSection({ title, credits }: CreditSectionProps) {
  if (credits.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>

      <CreditGrid credits={credits} />
    </section>
  );
}

const PersonCredits = ({
  knownFor,
  acting,
  directing,
  writing,
  production,
  otherCrew,
}: PersonCreditsProps) => {
  return (
    <section>
      <div className="container-content space-y-16 py-14 lg:space-y-20 lg:py-20">
        {knownFor.length > 0 && (
          <section>
            <div className="mb-8">
              <p className="eyebrow">Known for</p>
              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Featured work
              </h2>
            </div>

            <CreditGrid credits={knownFor} />
          </section>
        )}

        <PersonFilmography movies={acting.movies} tv={acting.tv} />

        <CreditSection title="Directing" credits={directing} />

        <CreditSection title="Writing" credits={writing} />

        <CreditSection title="Production" credits={production} />

        <CreditSection title="Other crew" credits={otherCrew} />
      </div>
    </section>
  );
};

export default PersonCredits;
