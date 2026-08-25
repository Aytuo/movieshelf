import MovieGrid from '@/components/movies/movie-grid';
import { movieRepository } from '@/lib/repositories';
import { redirect } from 'next/navigation';

const TrendingPage = async () => {
  redirect('/home');

  const movies = await movieRepository.getTrending();

  return (
    <section className="container-content py-12 lg:py-16">
      <div className="mb-10">
        <p className="text-sm font-medium text-primary">This week</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
          Trending now
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          See what people are discovering across TMDB right now.
        </p>
      </div>

      <MovieGrid movies={movies} />
    </section>
  );
};

export default TrendingPage;
