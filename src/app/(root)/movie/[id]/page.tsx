import MovieVideo from '@/components/movies/moive-video';
import MovieCast from '@/components/movies/movie-cast';
import MovieDetails from '@/components/movies/movie-details';
import MovieRecommendations from '@/components/movies/movie-recomendations';
import { requireSession } from '@/lib/auth/require-session';
import { movieRepository } from '@/lib/repositories';
import { getUserMovieState } from '@/lib/repositories/user-movie-repository';
import { notFound } from 'next/navigation';

type MovieDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const MovieDetailsPage = async ({ params }: MovieDetailsPageProps) => {
  const { id } = await params;

  const movieId = Number(id);

  if (!Number.isInteger(movieId)) {
    notFound();
  }

  const movie = await movieRepository.getById(movieId);

  if (!movie) {
    notFound();
  }

  const session = await requireSession();

  const dbMovieState = await getUserMovieState(
    session.user.id,
    `tmdb_${movie.id}`
  );

  return (
    <>
      <MovieDetails
        movie={movie}
        userMovie={
          dbMovieState
            ? {
                inShelf: true,
                status: dbMovieState.status,
                favorite: dbMovieState.favorite,
                rating: dbMovieState.rating,
              }
            : {
                inShelf: false,
                status: null,
                favorite: false,
                rating: null,
              }
        }
      />

      <MovieCast cast={movie.cast} />

      <MovieVideo
        video={
          movie.videos.find(
            (video) =>
              video.site === 'YouTube' &&
              video.type === 'Trailer' &&
              video.official
          ) ??
          movie.videos.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
          ) ??
          null
        }
      />

      <MovieRecommendations
        movies={movie.similar}
        title="Similar movies"
        eyebrow="If you liked this"
      />

      <MovieRecommendations
        movies={movie.recommendations}
        title="More like this"
        eyebrow="From TMDB"
      />
    </>
  );
};

export default MovieDetailsPage;
