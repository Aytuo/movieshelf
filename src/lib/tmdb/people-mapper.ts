import type { Person, PersonCredit, PersonSearchItem } from '@/types';
import type {
  TmdbPersonBundle,
  TmdbPersonMovieCastCredit,
  TmdbPersonMovieCrewCredit,
  TmdbPersonResult,
  TmdbPersonTvCastCredit,
  TmdbPersonTvCrewCredit,
} from './types';

export function mapTmdbPerson(person: TmdbPersonBundle): Person {
  return {
    id: person.id,
    name: person.name,
    biography: person.biography,
    birthday: person.birthday,
    deathday: person.deathday,
    placeOfBirth: person.place_of_birth,
    knownForDepartment: person.known_for_department,
    popularity: person.popularity,
    profilePath: person.profile_path,
    homepage: person.homepage,
    imdbId: person.imdb_id,
  };
}

export function mapTmdbPersonSearchItem(
  person: TmdbPersonResult
): PersonSearchItem {
  return {
    id: person.id,
    name: person.name,
    profilePath: person.profile_path,
    knownForDepartment: person.known_for_department,
    popularity: person.popularity,
  };
}

export function mapTmdbPersonCastCredit(
  credit: TmdbPersonMovieCastCredit | TmdbPersonTvCastCredit
): PersonCredit {
  const isMovie = credit.media_type === 'movie';

  return {
    tmdbId: credit.id,
    type: isMovie ? 'movie' : 'tv',
    title: isMovie ? credit.title : credit.name,
    originalTitle: isMovie ? credit.original_title : credit.original_name,
    overview: credit.overview,
    posterPath: credit.poster_path,
    backdropPath: credit.backdrop_path,
    releaseDate: isMovie
      ? credit.release_date || null
      : credit.first_air_date || null,
    rating: credit.vote_average,
    voteCount: credit.vote_count,
    popularity: credit.popularity,
    creditId: credit.credit_id,
    character: credit.character,
    job: null,
    department: null,
    episodeCount: 'episode_count' in credit ? credit.episode_count : null,
    castOrder: 'order' in credit ? credit.order : null,
  };
}

export function mapTmdbPersonCrewCredit(
  credit: TmdbPersonMovieCrewCredit | TmdbPersonTvCrewCredit
): PersonCredit {
  const isMovie = credit.media_type === 'movie';

  return {
    tmdbId: credit.id,
    type: isMovie ? 'movie' : 'tv',
    title: isMovie ? credit.title : credit.name,
    originalTitle: isMovie ? credit.original_title : credit.original_name,
    overview: credit.overview,
    posterPath: credit.poster_path,
    backdropPath: credit.backdrop_path,
    releaseDate: isMovie
      ? credit.release_date || null
      : credit.first_air_date || null,
    rating: credit.vote_average,
    voteCount: credit.vote_count,
    popularity: credit.popularity,
    creditId: credit.credit_id,
    character: null,
    job: credit.job,
    department: credit.department,
    episodeCount: 'episode_count' in credit ? credit.episode_count : null,
    castOrder: null,
  };
}
