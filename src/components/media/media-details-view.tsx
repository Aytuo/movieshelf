import type { MediaDetails } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaInteraction } from '@/types';
import { Star } from 'lucide-react';
import ReviewCard from '../reviews/review-card';
import ReviewForm from '../reviews/review-form';
import MediaActions from './media-actions';
import MediaCast from './media-cast';
import MediaRecommendations from './media-recommendations';
import MediaVideo from './media-video';

type MediaDetailsViewProps = {
  media: MediaDetails;

  mediaInteraction: MediaInteraction | null;

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

  watchNumber: number | null;
};

function getYear(releaseDate: string | null): number | null {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

const MediaDetailsView = ({
  media,
  mediaInteraction,
  existingReview,
  reviews,
  watchNumber,
}: MediaDetailsViewProps) => {
  const poster = tmdbImage(media.posterPath, 'w500');

  const backdrop = tmdbImage(media.backdropPath, 'w1280');

  const isMovie = media.type === 'movie';

  const year = getYear(media.releaseDate);

  const isWatched = mediaInteraction?.status === 'watched';

  const initialState = {
    inShelf: mediaInteraction !== null,

    status:
      mediaInteraction?.status === 'watchlist' ||
      mediaInteraction?.status === 'watched'
        ? mediaInteraction.status
        : null,

    favorite: mediaInteraction?.favorite ?? false,

    rating: mediaInteraction?.rating ?? null,

    watchNumber,
  };

  const directors =
    media.type === 'movie'
      ? media.crew.filter((person) => person.job === 'Director')
      : [];

  const writers =
    media.type === 'movie'
      ? media.crew.filter(
          (person) =>
            person.job === 'Writer' ||
            person.job === 'Screenplay' ||
            person.job === 'Story'
        )
      : [];

  const trailer =
    media.videos.find(
      (video) =>
        video.site === 'YouTube' && video.type === 'Trailer' && video.official
    ) ??
    media.videos.find(
      (video) => video.site === 'YouTube' && video.type === 'Trailer'
    ) ??
    null;

  return (
    <main>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}

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
            {/* Poster */}
            <div className="mx-auto w-full max-w-[280px]">
              <div className="poster-frame">
                {poster && (
                  <img
                    src={poster}
                    alt={`${media.title} poster`}
                    className="aspect-[2/3] w-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {year !== null && <span>{year}</span>}

                <span className="rounded-md bg-surface px-2 py-1 text-[10px] font-semibold tracking-wide uppercase">
                  {isMovie ? 'Movie' : 'TV Series'}
                </span>

                {media.type === 'movie' && media.runtime !== null && (
                  <>
                    <span>•</span>

                    <span>{media.runtime} min</span>
                  </>
                )}
              </div>

              <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {media.title}
              </h1>

              {media.tagline && (
                <p className="mt-3 text-base text-muted-foreground italic">
                  {media.tagline}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                {media.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {media.overview}
              </p>

              {/* Movie-specific crew */}
              {media.type === 'movie' &&
                (directors.length > 0 || writers.length > 0) && (
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
                )}

              {/* TV-specific metadata */}
              {media.type === 'tv' && (
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Seasons
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {media.numberOfSeasons}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Episodes
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {media.numberOfEpisodes}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Status
                    </p>

                    <p className="mt-2 text-sm font-medium">
                      {media.status ?? '—'}
                    </p>
                  </div>
                </div>
              )}

              {/* TMDB rating */}
              <div className="mt-7 flex items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-sm font-semibold">
                  <Star className="size-4 fill-current text-rating" />

                  {media.rating.toFixed(1)}
                </div>

                <span className="text-xs text-muted-foreground">
                  {media.voteCount.toLocaleString()} votes
                </span>
              </div>

              {/* User actions */}
              <div className="mt-7">
                <MediaActions
                  type={media.type}
                  tmdbId={media.tmdbId}
                  initialState={initialState}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TV seasons                                                       */}
      {/* ---------------------------------------------------------------- */}

      {media.type === 'tv' && media.seasons.length > 0 && (
        <section className="border-t border-border/60">
          <div className="container-content py-14 lg:py-20">
            <div className="mb-8">
              <p className="eyebrow">Series information</p>

              <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
                Seasons
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {media.seasons
                .filter((season) => season.seasonNumber >= 0)
                .map((season) => {
                  const seasonPoster = tmdbImage(season.posterPath, 'w342');

                  return (
                    <article
                      key={season.id}
                      className="overflow-hidden rounded-2xl surface"
                    >
                      <div className="grid grid-cols-[96px_1fr] gap-4">
                        <div className="aspect-[2/3] bg-surface-hover">
                          {seasonPoster && (
                            <img
                              src={seasonPoster}
                              alt={`${season.name} poster`}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        <div className="py-4 pr-4">
                          <h3 className="font-heading text-base font-semibold">
                            {season.name}
                          </h3>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {season.episodeCount}{' '}
                            {season.episodeCount === 1 ? 'episode' : 'episodes'}
                          </p>

                          {season.airDate && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {getYear(season.airDate) ?? '—'}
                            </p>
                          )}

                          {season.overview && (
                            <p className="mt-3 line-clamp-4 text-xs leading-5 text-muted-foreground">
                              {season.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Cast                                                             */}
      {/* ---------------------------------------------------------------- */}

      <MediaCast cast={media.cast} />

      {/* ---------------------------------------------------------------- */}
      {/* Trailer                                                          */}
      {/* ---------------------------------------------------------------- */}

      <MediaVideo video={trailer} />

      {/* ---------------------------------------------------------------- */}
      {/* Review form                                                      */}
      {/* ---------------------------------------------------------------- */}

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
                  : media.type === 'movie'
                    ? 'What stayed with you after watching this film?'
                    : 'What did you think about this TV series?'}
              </p>
            </div>

            <div className="rounded-2xl p-5 surface sm:p-7">
              {isWatched ? (
                <ReviewForm
                  type={media.type}
                  tmdbId={media.tmdbId}
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
                    Once you&apos;ve marked this{' '}
                    {media.type === 'movie' ? 'movie' : 'TV series'} as watched,
                    you&apos;ll be able to rate it and write your review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Community reviews                                                */}
      {/* ---------------------------------------------------------------- */}

      <section className="border-t border-border/60 bg-surface/20">
        <div className="container-content py-14 lg:py-20">
          <div className="mb-8">
            <p className="eyebrow">From the community</p>

            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Reviews
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              See what other people thought about this{' '}
              {media.type === 'movie' ? 'movie' : 'TV series'}.
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
                Nobody has reviewed this{' '}
                {media.type === 'movie' ? 'movie' : 'TV series'} yet.
              </p>

              <p className="mt-1 text-xs text-muted-foreground/70">
                Be the first to share your thoughts.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Similar / recommendations                                        */}
      {/* ---------------------------------------------------------------- */}

      <MediaRecommendations
        media={media.similar}
        title={`Similar ${media.type === 'movie' ? 'movies' : 'TV series'}`}
        eyebrow="If you liked this"
      />

      <MediaRecommendations
        media={media.recommendations}
        title={
          media.type === 'movie' ? 'More like these' : 'More like these series'
        }
        eyebrow="From TMDB"
      />
    </main>
  );
};

export default MediaDetailsView;
