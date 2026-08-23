import { tmdbImage } from '@/lib/tmdb/images';
import { Star } from 'lucide-react';
import ReviewCard from '../reviews/review-card';
import ReviewForm from '../reviews/review-form';
import MovieVideo from './moive-video';
import MovieActions from './movie-actions';
import MovieCast from './movie-cast';
import MovieRecommendations from './movie-recomendations';

type MovieDetailsViewProps = {
  movie: MovieDetails;
  userMovie: {
    inShelf: boolean;
    status: 'watchlist' | 'watched' | null;
    favorite: boolean;
    rating: number | null;
  };
  existingReview: {
    id: string;
    title: string | null;
    content: string;
    rating: number | null;
    containsSpoilers: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  reviews: {
    review: {
      id: string;
      title: string | null;
      content: string;
      rating: number | null;
      containsSpoilers: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
    profile: {
      username: string;
      displayName: string | null;
      avatarUrl: string | null;
    };
  }[];
};

const MovieDetailsView = ({
  movie,
  userMovie,
  existingReview,
  reviews,
}: MovieDetailsViewProps) => {
  const poster = tmdbImage(movie.posterPath, 'w500');
  const backdrop = tmdbImage(movie.backdropPath, 'w1280');

  const directors = movie.crew.filter((person) => person.job === 'Director');
  const writers = movie.crew.filter(
    (person) =>
      person.job === 'Writer' ||
      person.job === 'Screenplay' ||
      person.job === 'Story'
  );

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border/60">
        {backdrop && (
          <div className="absolute inset-0">
            <img
              src={backdrop}
              alt=""
              className="h-full w-full object-cover opacity-20"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          </div>
        )}

        <div className="relative container-content py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
            <div className="mx-auto w-full max-w-[280px]">
              <div className="poster-frame">
                {poster && (
                  <img
                    src={poster}
                    alt={`${movie.title} poster`}
                    className="aspect-[2/3] w-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {movie.releaseDate && (
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                )}

                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{movie.runtime} min</span>
                  </>
                )}
              </div>

              <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-3 text-base text-muted-foreground italic">
                  {movie.tagline}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {movie.overview}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {directors.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Directed by
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {directors.map((person) => (
                        <span
                          key={`${person.id}-${person.job}`}
                          className="text-sm font-medium text-foreground"
                        >
                          {person.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {writers.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Written by
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {writers.map((person) => (
                        <span
                          key={`${person.id}-${person.job}`}
                          className="text-sm font-medium text-foreground"
                        >
                          {person.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-7 flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-sm font-semibold">
                  <Star className="size-4 fill-current text-rating" />
                  {movie.rating.toFixed(1)}
                </div>

                <span className="text-xs text-muted-foreground">
                  {movie.voteCount.toLocaleString()} votes
                </span>
              </div>

              <div className="mt-7">
                <MovieActions movieId={movie.id} initialState={userMovie} />
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="border-t border-border/60">
        <div className="container-content py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div>
              <p className="eyebrow">Your thoughts</p>

              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                {existingReview ? 'Your review' : 'Write a review'}
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                {existingReview
                  ? 'Update your thoughts whenever your opinion changes.'
                  : 'What stayed with you after watching this film?'}
              </p>
            </div>

            <div className="rounded-2xl p-5 surface sm:p-7">
              {userMovie.status === 'watched' ? (
                <ReviewForm
                  movieId={movie.id}
                  initialValues={
                    existingReview
                      ? {
                          title: existingReview.title ?? '',
                          content: existingReview.content,
                          rating: existingReview.rating ?? 8,
                          containsSpoilers: existingReview.containsSpoilers,
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="rounded-2xl p-6 surface">
                  <p className="text-sm font-medium">Watch it first.</p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Once you&apos;ve marked this movie as watched, you&apos;ll
                    be able to rate it and write your review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-surface/20">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-8">
            <p className="eyebrow">From the community</p>

            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Reviews
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              See what other people thought about this movie.
            </p>
          </div>

          {reviews.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {reviews.map(({ review, profile }) => (
                <ReviewCard key={review.id} review={review} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Nobody has reviewed this movie yet.
              </p>

              <p className="mt-1 text-xs text-muted-foreground/70">
                Be the first to share your thoughts.
              </p>
            </div>
          )}
        </div>
      </section>

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
    </main>
  );
};

export default MovieDetailsView;
