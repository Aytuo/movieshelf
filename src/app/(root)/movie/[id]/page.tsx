import MovieDetails from '@/components/movies/movie-details-view';
import { requireSession } from '@/lib/auth/require-session';
import { tmdbMovieRepository } from '@/lib/repositories';
import {
  getMovieReviews,
  getUserReviewForMovie,
} from '@/lib/repositories/review-repository';
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

  const movie = await tmdbMovieRepository.getById(movieId);

  if (!movie) {
    notFound();
  }

  const session = await requireSession();

  const dbMovieState = await getUserMovieState(
    session.user.id,
    `tmdb_${movie.tmdbId}`
  );

  const [existingReview, reviews] = await Promise.all([
    getUserReviewForMovie(session.user.id, `tmdb_${movie.tmdbId}`),
    getMovieReviews(`tmdb_${movie.tmdbId}`),
  ]);

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
        existingReview={existingReview}
        reviews={reviews}
      />
    </>
  );
};

export default MovieDetailsPage;
