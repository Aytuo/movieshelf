import {
  getPersonDetails,
  searchPeople as searchPeopleApi,
} from '@/lib/tmdb/people-api';
import type {
  Person,
  PersonCredit,
  PersonProfile,
  PersonSearchResult,
} from '@/types';
import { paginateSearchItems } from '../search/pagination';
import {
  mapTmdbPerson,
  mapTmdbPersonCastCredit,
  mapTmdbPersonCrewCredit,
  mapTmdbPersonSearchItem,
} from '../tmdb/people-mapper';

function isNonRoleAppearance(credit: PersonCredit) {
  const character = credit.character?.trim().toLowerCase();

  if (!character) {
    return false;
  }

  return [
    'self',
    'himself',
    'herself',
    'themselves',
    'archive footage',
    'archive audio',
  ].some((value) => character.includes(value));
}

function isKnownForCrewRole(
  credit: PersonCredit,
  department: string | null
): boolean {
  switch (department) {
    case 'Directing':
      return credit.job === 'Director';

    case 'Writing':
      return (
        credit.job === 'Writer' ||
        credit.job === 'Screenplay' ||
        credit.job === 'Story'
      );

    case 'Production':
      return (
        credit.job === 'Producer' ||
        credit.job === 'Executive Producer' ||
        credit.job === 'Co-Producer' ||
        credit.job === 'Associate Producer'
      );

    default:
      return false;
  }
}

function getKnownForScore(
  credit: PersonCredit,
  department: string | null
): number {
  const voteScore = Math.log10(credit.voteCount + 1);
  const popularityScore = Math.log10(credit.popularity + 1);
  const ratingScore = credit.rating / 10;

  if (department === 'Acting') {
    const billingBonus =
      credit.castOrder !== null ? Math.max(0, 1 - credit.castOrder / 20) : 0;

    const mediaBonus = credit.type === 'movie' ? 0.2 : 0;

    const tvAppearancePenalty =
      credit.type === 'tv' && (credit.episodeCount ?? 0) <= 1 ? 0.35 : 1;

    return (
      (voteScore * 0.45 +
        popularityScore * 0.25 +
        ratingScore * 0.2 +
        billingBonus * 0.1 +
        mediaBonus) *
      tvAppearancePenalty
    );
  }

  let score = voteScore * 0.45 + popularityScore * 0.35 + ratingScore * 0.2;

  if (department === 'Directing') {
    if (credit.type === 'movie') {
      score *= 1.25;
    } else {
      score *= 0.3;
    }
  }

  if (department === 'Writing') {
    if (credit.type === 'movie') {
      score *= 1.15;
    } else {
      score *= 0.8;
    }
  }

  if (department === 'Production') {
    if (credit.type === 'movie') {
      score *= 1.1;
    } else {
      score *= 0.75;
    }
  }

  return score;
}

function getKnownFor(
  person: Person,
  castCredits: PersonCredit[],
  crewCredits: PersonCredit[]
): PersonCredit[] {
  if (person.knownForDepartment === 'Acting') {
    return castCredits
      .filter((credit) => !isNonRoleAppearance(credit))
      .filter(
        (credit) =>
          credit.type === 'tv' ||
          credit.castOrder === null ||
          credit.castOrder <= 20
      )
      .sort(
        (a, b) => getKnownForScore(b, 'Acting') - getKnownForScore(a, 'Acting')
      )
      .slice(0, 10);
  }

  return crewCredits
    .filter((credit) => !isNonRoleAppearance(credit))
    .filter((credit) => isKnownForCrewRole(credit, person.knownForDepartment))
    .sort(
      (a, b) =>
        getKnownForScore(b, person.knownForDepartment) -
        getKnownForScore(a, person.knownForDepartment)
    )
    .slice(0, 10);
}

function splitActingCredits(credits: PersonCredit[]) {
  return {
    movies: sortCreditsByDate(
      credits.filter((credit) => credit.type === 'movie')
    ),
    tv: sortCreditsByDate(credits.filter((credit) => credit.type === 'tv')),
  };
}

function getCreditDate(credit: PersonCredit) {
  return credit.releaseDate ?? '';
}

function sortCreditsByDate(credits: PersonCredit[]): PersonCredit[] {
  return [...credits].sort((a, b) => {
    const dateA = getCreditDate(a);
    const dateB = getCreditDate(b);

    if (dateA && dateB) {
      return dateB.localeCompare(dateA);
    }

    if (dateA) {
      return -1;
    }

    if (dateB) {
      return 1;
    }

    return b.popularity - a.popularity;
  });
}

function dedupeCredits(credits: PersonCredit[]): PersonCredit[] {
  const seen = new Set<string>();

  return credits.filter((credit) => {
    const key = `${credit.type}:${credit.tmdbId}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function dedupeCrewCredits(credits: PersonCredit[]): PersonCredit[] {
  const seen = new Set<string>();

  return credits.filter((credit) => {
    const key = `${credit.type}:${credit.tmdbId}:${credit.job}:${credit.creditId}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function dedupeCreditsByMedia(credits: PersonCredit[]): PersonCredit[] {
  const seen = new Set<string>();

  return credits.filter((credit) => {
    const key = `${credit.type}:${credit.tmdbId}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function getCrewSections(credits: PersonCredit[]) {
  const directing = dedupeCreditsByMedia(
    credits.filter((credit) => credit.job === 'Director')
  );

  const writing = dedupeCreditsByMedia(
    credits.filter(
      (credit) =>
        credit.job === 'Writer' ||
        credit.job === 'Screenplay' ||
        credit.job === 'Story'
    )
  );

  const production = dedupeCreditsByMedia(
    credits.filter(
      (credit) =>
        credit.job === 'Producer' ||
        credit.job === 'Executive Producer' ||
        credit.job === 'Co-Producer' ||
        credit.job === 'Associate Producer'
    )
  );

  const categorized = new Set(
    [...directing, ...writing, ...production].map(
      (credit) => `${credit.type}:${credit.tmdbId}:${credit.creditId}`
    )
  );

  const otherCrew = dedupeCreditsByMedia(
    credits.filter(
      (credit) =>
        !categorized.has(`${credit.type}:${credit.tmdbId}:${credit.creditId}`)
    )
  );

  return {
    directing,
    writing,
    production,
    otherCrew,
  };
}

export async function getPersonProfile(
  personId: number
): Promise<PersonProfile | null> {
  const data = await getPersonDetails(personId);

  if (!data) {
    return null;
  }

  const cast = (data.combined_credits?.cast ?? []).map(mapTmdbPersonCastCredit);
  const crew = (data.combined_credits?.crew ?? []).map(mapTmdbPersonCrewCredit);

  const dedupedCast = dedupeCredits(cast);
  const dedupedCrew = dedupeCrewCredits(crew);

  const acting = splitActingCredits(dedupedCast);

  const { directing, writing, production, otherCrew } =
    getCrewSections(dedupedCrew);

  const person = mapTmdbPerson(data);

  const knownFor = getKnownFor(person, dedupedCast, dedupedCrew);

  return {
    person,
    knownFor,
    acting,
    directing: sortCreditsByDate(directing),
    writing: sortCreditsByDate(writing),
    production: sortCreditsByDate(production),
    otherCrew: sortCreditsByDate(otherCrew),
  };
}

export async function searchPeople(
  query: string,
  page = 1
): Promise<PersonSearchResult> {
  const response = await paginateSearchItems(page, (tmdbPage) =>
    searchPeopleApi(query, tmdbPage)
  );

  return {
    people: response.items.map(mapTmdbPersonSearchItem),
    page: response.page,
    totalPages: response.totalPages,
    totalResults: response.totalResults,
  };
}
