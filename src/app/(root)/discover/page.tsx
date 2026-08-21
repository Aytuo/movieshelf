import MovieGrid from '@/components/movies/movie-grid';
import { MOCK_MOVIES } from '@/constants';

const DiscoverPage = () => {
  return (
    <section className="container-content py-12 lg:py-16">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Explore</p>

          <h1 className="font-heading mt-2 text-4xl font-bold tracking-tight">
            Discover movies
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Find something worth adding to your shelf.
          </p>
        </div>
      </div>

      <MovieGrid movies={MOCK_MOVIES} />
    </section>
  );
};

export default DiscoverPage;
