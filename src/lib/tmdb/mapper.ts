import { TMDB_GENRES } from './genres';

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
