import type {
  MediaCastMember,
  MediaCrewMember,
  MediaGenre,
  MediaVideo,
  Movie,
  MovieDetails,
  TvCreator,
  TvDetails,
  TvSeason,
  TvShow,
} from '@/lib/media';
import { TMDB_MOVIES_GENRES, TMDB_TV_GENRES } from './genres';
import type {
  TmdbCreditCast,
  TmdbCreditCrew,
  TmdbMovieBundle,
  TmdbMovieResult,
  TmdbTvAggregateCast,
  TmdbTvBundle,
  TmdbTvResult,
  TmdbVideo,
} from './types';

/* ========================================================================== */
/*                              BASIC MEDIA                                   */
/* ========================================================================== */

function mapMovieResult(movie: TmdbMovieResult): Movie {
  return {
    tmdbId: movie.id,
    type: 'movie',
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview ?? '',
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date || null,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    originalLanguage: movie.original_language,
    genres: (movie.genre_ids ?? []).map((id) =>
      mapGenre(id, TMDB_MOVIES_GENRES)
    ),
  };
}

function mapTvResult(tv: TmdbTvResult): TvShow {
  return {
    tmdbId: tv.id,
    type: 'tv',
    title: tv.name,
    originalTitle: tv.original_name,
    overview: tv.overview ?? '',
    posterPath: tv.poster_path,
    backdropPath: tv.backdrop_path,
    releaseDate: tv.first_air_date || null,
    rating: tv.vote_average,
    voteCount: tv.vote_count,
    originalLanguage: tv.original_language,
    genres: (tv.genre_ids ?? []).map((id) => mapGenre(id, TMDB_TV_GENRES)),
  };
}

/* ========================================================================== */
/*                              MOVIE DETAILS                                 */
/* ========================================================================== */

function mapMovieCastMember(person: TmdbCreditCast): MediaCastMember {
  return {
    id: person.id,
    name: person.name,
    character: person.character,
    profilePath: person.profile_path,
    order: person.order,
  };
}

function mapCrewMember(person: TmdbCreditCrew): MediaCrewMember {
  return {
    id: person.id,
    name: person.name,
    job: person.job,
    department: person.department,
    profilePath: person.profile_path,
  };
}

/* ========================================================================== */
/*                               VIDEO                                        */
/* ========================================================================== */

function mapVideo(video: TmdbVideo): MediaVideo {
  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: video.official,
  };
}

/* ========================================================================== */
/*                                TV DETAILS                                  */
/* ========================================================================== */

function mapTvCastMember(person: TmdbTvAggregateCast): MediaCastMember {
  return {
    id: person.id,
    name: person.name,
    character: person.roles?.[0]?.character ?? 'Unknown',
    profilePath: person.profile_path,
    order: 0,
  };
}

function mapGenre(id: number, genres: Record<number, string>): MediaGenre {
  return {
    id,
    name: genres[id] ?? 'Unknown',
  };
}

function mapTvCreator(creator: {
  id: number;
  name: string;
  profile_path: string | null;
}): TvCreator {
  return {
    id: creator.id,
    name: creator.name,
    profilePath: creator.profile_path,
  };
}

function mapTvSeason(season: {
  id: number;
  name: string;
  overview: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}): TvSeason {
  return {
    id: season.id,
    name: season.name,
    overview: season.overview ?? '',
    seasonNumber: season.season_number,
    episodeCount: season.episode_count,
    airDate: season.air_date,
    posterPath: season.poster_path,
  };
}

/* ========================================================================== */
/*                              PUBLIC MAPPERS                                 */
/* ========================================================================== */

export function mapTmdbMovie(movie: TmdbMovieResult): Movie {
  return mapMovieResult(movie);
}

export function mapTmdbTv(tv: TmdbTvResult): TvShow {
  return mapTvResult(tv);
}

export function mapTmdbMovieDetails(movie: TmdbMovieBundle): MovieDetails {
  return {
    ...mapMovieResult(movie),
    type: 'movie',
    tagline: movie.tagline,
    runtime: movie.runtime,
    cast: (movie.credits?.cast ?? []).slice(0, 12).map(mapMovieCastMember),
    crew: (movie.credits?.crew ?? []).map(mapCrewMember),
    videos: (movie.videos?.results ?? []).map(mapVideo),
    similar: (movie.similar?.results ?? []).slice(0, 6).map(mapMovieResult),
    recommendations: (movie.recommendations?.results ?? [])
      .slice(0, 6)
      .map(mapMovieResult),
  };
}

export function mapTmdbTvDetails(tv: TmdbTvBundle): TvDetails {
  return {
    ...mapTvResult(tv),
    type: 'tv',
    tagline: tv.tagline,
    lastAirDate: tv.last_air_date,
    numberOfSeasons: tv.number_of_seasons,
    numberOfEpisodes: tv.number_of_episodes,
    status: tv.status,
    creators: tv.created_by.map(mapTvCreator),
    seasons: tv.seasons.map(mapTvSeason),
    cast: (tv.aggregate_credits?.cast ?? []).slice(0, 12).map(mapTvCastMember),
    crew: [],
    videos: (tv.videos?.results ?? []).map(mapVideo),
    similar: (tv.similar?.results ?? []).slice(0, 6).map(mapTvResult),
    recommendations: (tv.recommendations?.results ?? [])
      .slice(0, 6)
      .map(mapTvResult),
  };
}
