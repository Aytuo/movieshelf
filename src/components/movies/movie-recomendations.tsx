import { Media } from '@/lib/media';
import MovieCard from './movie-card';

type MovieRecommendationsProps = {
  movies: Media[];
  title?: string;
  eyebrow?: string;
};

const MovieRecommendations = ({
  movies,
  title = 'You might also like',
  eyebrow = 'Keep exploring',
}: MovieRecommendationsProps) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="container-content py-14 lg:py-20">
      <div className="mb-7">
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {movies.slice(0, 6).map((movie) => (
          <MovieCard key={movie.tmdbId} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieRecommendations;
