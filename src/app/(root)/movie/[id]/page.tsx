import MovieDetails from '@/components/movies/movie-details';
import { movieRepository } from '@/lib/repositories';
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

  return <MovieDetails movie={movie} />;
};

export default MovieDetailsPage;
