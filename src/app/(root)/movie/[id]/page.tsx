import MovieDetails from '@/components/movies/movie-details';
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
  );
};

export default MovieDetailsPage;
