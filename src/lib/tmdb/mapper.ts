export function mapTmdbMovie(movie: TmdbMovieResult): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview ?? '',
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    runtime: null,
    genres: [],
    rating: movie.vote_average,
    voteCount: movie.vote_count,
  };
}

export function mapTmdbMovieDetails(movie: TmdbMovieDetails): Movie {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview ?? '',
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name),
    rating: movie.vote_average,
    voteCount: movie.vote_count,
    tagline: movie.tagline ?? undefined,
  };
}
