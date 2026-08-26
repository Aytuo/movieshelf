import { TMDB_GENRES } from './genres';
import { TMDB_TV_GENRES } from './tv-genres';

function mapMovieResult(movie: TmdbMovieResult): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview ?? '',
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    runtime: null,
    genres: (movie.genre_ids ?? [])
      .map((id) => TMDB_GENRES[id])
      .filter((genre): genre is string => Boolean(genre)),
    originalLanguage: movie.original_language,
    rating: movie.vote_average,
    voteCount: movie.vote_count,
  };
}

function mapCastMember(person: TmdbCreditCast): MovieCastMember {
  return {
    id: person.id,
    name: person.name,
    character: person.character,
    profilePath: person.profile_path,
    order: person.order,
  };
}

function mapCrewMember(person: TmdbCreditCrew): MovieCrewMember {
  return {
    id: person.id,
    name: person.name,
    job: person.job,
    department: person.department,
    profilePath: person.profile_path,
  };
}

function mapVideo(video: TmdbVideo): MovieVideo {
  return {
    id: video.id,
    key: video.key,
    name: video.name,
    site: video.site,
    type: video.type,
    official: video.official,
  };
}

export function mapTmdbMovie(movie: TmdbMovieResult): Movie {
  return mapMovieResult(movie);
}

export function mapTmdbMovieDetails(movie: TmdbMovieBundle): MovieDetails {
  return {
    ...mapMovieResult(movie),
    tagline: movie.tagline ?? undefined,
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name),
    cast: (movie.credits?.cast ?? []).slice(0, 12).map(mapCastMember),
    crew: (movie.credits?.crew ?? []).map(mapCrewMember),
    videos: (movie.videos?.results ?? []).map(mapVideo),
    similar: (movie.similar?.results ?? []).slice(0, 6).map(mapMovieResult),
    recommendations: (movie.recommendations?.results ?? [])
      .slice(0, 6)
      .map(mapMovieResult),
  };
}

function mapTvResult(tv: TmdbTvResult): TvShow {
  return {
    id: tv.id,
    name: tv.name,
    originalName: tv.original_name,
    overview: tv.overview ?? '',
    posterPath: tv.poster_path,
    backdropPath: tv.backdrop_path,
    firstAirDate: tv.first_air_date,
    genres: (tv.genre_ids ?? [])
      .map((id) => TMDB_TV_GENRES[id])
      .filter((genre): genre is string => Boolean(genre)),
    originalLanguage: tv.original_language,
    rating: tv.vote_average,
    voteCount: tv.vote_count,
  };
}

function mapTvCastMember(person: TmdbTvAggregateCast): TvCastMember {
  return {
    id: person.id,
    name: person.name,
    character: person.roles?.[0]?.character ?? 'Unknown',
    profilePath: person.profile_path,
    order: 0,
  };
}

export function mapTmdbTv(tv: TmdbTvResult): TvShow {
  return mapTvResult(tv);
}

export function mapTmdbTvDetails(tv: TmdbTvBundle): TvShowDetails {
  return {
    ...mapTvResult({
      id: tv.id,
      name: tv.name,
      original_name: tv.original_name,
      overview: tv.overview,
      poster_path: tv.poster_path,
      backdrop_path: tv.backdrop_path,
      first_air_date: tv.first_air_date,
      genre_ids: tv.genres.map((genre) => genre.id),
      vote_average: tv.vote_average,
      vote_count: tv.vote_count,
      popularity: tv.popularity,
      adult: tv.adult,
      original_language: tv.original_language,
    }),
    lastAirDate: tv.last_air_date,
    numberOfSeasons: tv.number_of_seasons,
    numberOfEpisodes: tv.number_of_episodes,
    status: tv.status,
    tagline: tv.tagline,
    genres: tv.genres.map((genre) => genre.name),
    creators: tv.created_by.map((creator) => ({
      id: creator.id,
      name: creator.name,
      profilePath: creator.profile_path,
    })),
    seasons: tv.seasons.map((season) => ({
      id: season.id,
      name: season.name,
      overview: season.overview ?? '',
      seasonNumber: season.season_number,
      episodeCount: season.episode_count,
      airDate: season.air_date,
      posterPath: season.poster_path,
    })),
    cast: (tv.aggregate_credits?.cast ?? []).slice(0, 12).map(mapTvCastMember),
    videos: (tv.videos?.results ?? []).map(mapVideo),
    similar: (tv.similar?.results ?? []).slice(0, 6).map(mapTvResult),
    recommendations: (tv.recommendations?.results ?? [])
      .slice(0, 6)
      .map(mapTvResult),
  };
}
