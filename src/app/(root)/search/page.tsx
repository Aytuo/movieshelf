import MovieGrid from '@/components/movies/movie-grid';
import { movieRepository } from '@/lib/repositories';

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams;

  const movies = q ? await movieRepository.search(q) : [];

  return (
    <section className="container-content py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Find a movie</p>

        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">
          Search
        </h1>
      </div>

      <form className="mb-10 flex max-w-2xl gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search movies..."
          className="input flex-1"
        />

        <button
          type="submit"
          className="rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Search
        </button>
      </form>

      {q ? (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            Results for{' '}
            <span className="font-medium text-foreground">&quot;{q}&quot;</span>
          </p>

          <MovieGrid movies={movies} />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-6 py-20 text-center text-sm text-muted-foreground">
          Search for a movie to get started.
        </div>
      )}
    </section>
  );
};

export default SearchPage;
