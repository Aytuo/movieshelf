import {
  getPersonDetails,
  searchPeople as searchPeopleApi,
} from '@/lib/tmdb/people-api';
import type { TmdbPersonResult } from '@/lib/tmdb/types';
import type {
  PersonCredit,
  PersonProfile,
  PersonSearchItem,
  PersonSearchResult,
} from '@/types';
import {
  mapTmdbPerson,
  mapTmdbPersonCastCredit,
  mapTmdbPersonCrewCredit,
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

function getKnownForScore(credit: PersonCredit) {
  const voteScore = Math.log10(credit.voteCount + 1);
  const popularityScore = Math.log10(credit.popularity + 1);
  const ratingScore = credit.rating / 10;

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

function getKnownFor(credits: PersonCredit[]) {
  return credits
    .filter((credit) => !isNonRoleAppearance(credit))
    .filter(
      (credit) =>
        credit.type === 'tv' ||
        credit.castOrder === null ||
        credit.castOrder <= 20
    )
    .sort((a, b) => getKnownForScore(b) - getKnownForScore(a))
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

function mapPersonSearchItem(person: TmdbPersonResult): PersonSearchItem {
  return {
    id: person.id,
    name: person.name,
    profilePath: person.profile_path,
    knownForDepartment: person.known_for_department,
    popularity: person.popularity,
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

function getCrewSections(credits: PersonCredit[]) {
  const directing = credits.filter((credit) => credit.job === 'Director');

  const writing = credits.filter(
    (credit) =>
      credit.job === 'Writer' ||
      credit.job === 'Screenplay' ||
      credit.job === 'Story'
  );

  const production = credits.filter(
    (credit) =>
      credit.job === 'Producer' ||
      credit.job === 'Executive Producer' ||
      credit.job === 'Co-Producer' ||
      credit.job === 'Associate Producer'
  );

  const categorized = new Set(
    [...directing, ...writing, ...production].map(
      (credit) => `${credit.type}:${credit.tmdbId}:${credit.creditId}`
    )
  );

  const otherCrew = credits.filter(
    (credit) =>
      !categorized.has(`${credit.type}:${credit.tmdbId}:${credit.creditId}`)
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
  const dedupedCrew = dedupeCredits(crew);

  const acting = splitActingCredits(dedupedCast);

  const { directing, writing, production, otherCrew } =
    getCrewSections(dedupedCrew);

  const knownFor = getKnownFor(dedupedCast);

  return {
    person: mapTmdbPerson(data),
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
  const response = await searchPeopleApi(query, page);

  return {
    people: response.results.map(mapPersonSearchItem),
    page: response.page,
    totalPages: response.total_pages,
    totalResults: response.total_results,
  };
}
