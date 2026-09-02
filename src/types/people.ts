import type { MediaType } from '@/lib/media';

export type Person = {
  id: number;
  name: string;
  biography: string | null;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  knownForDepartment: string | null;
  popularity: number;
  profilePath: string | null;
  homepage: string | null;
  imdbId: string | null;
};

export type PersonCredit = {
  tmdbId: number;
  type: MediaType;
  title: string;
  originalTitle: string;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  rating: number;
  voteCount: number;
  popularity: number;
  creditId: string;
  character: string | null;
  job: string | null;
  department: string | null;
  episodeCount: number | null;
  castOrder: number | null;
};

export type PersonProfile = {
  person: Person;
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

export type PersonSearchItem = {
  id: number;
  name: string;
  profilePath: string | null;
  knownForDepartment: string | null;
  popularity: number;
};

export type PersonSearchResult = {
  people: PersonSearchItem[];
  page: number;
  totalPages: number;
  totalResults: number;
};
