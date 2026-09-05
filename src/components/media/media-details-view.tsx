import type { MediaDetails } from '@/lib/media';
import { tmdbImage } from '@/lib/tmdb/images';
import type { MediaInteraction } from '@/types';
import { Eye, Search, Star } from 'lucide-react';
import Link from 'next/link';
import ReviewCard from '../reviews/review-card';
import ReviewForm from '../reviews/review-form';
import TvSeasons from '../tv/tv-seasons';
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

  showType?: boolean;
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
  showType = false,
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

                {showType && (
                  <span className="rounded-md bg-surface px-2 py-1 text-[10px] font-semibold tracking-wide uppercase">
                    {isMovie ? 'Movie' : 'TV Series'}
                  </span>
                )}

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
                            <Link
                              key={`${person.id}-${person.job}`}
                              href={`/person/${person.id}`}
                              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                            >
                              {person.name}
                            </Link>
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
                            <Link
                              key={`${person.id}-${person.job}`}
                              href={`/person/${person.id}`}
                              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                            >
                              {person.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* TV-specific metadata */}
              {media.type === 'tv' && (
                <div className="mt-7">
                  <div className="grid gap-4 sm:grid-cols-3">
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

                  {media.creators.length > 0 && (
                    <div className="mt-6">
                      <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                        Created by
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {media.creators.map((creator) => (
                          <Link
                            key={creator.id}
                            href={`/person/${creator.id}`}
                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {creator.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
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
                <MediaActions media={media} initialState={initialState} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TV seasons                                                       */}
      {/* ---------------------------------------------------------------- */}

      {media.type === 'tv' && media.seasons.length > 0 && (
        <TvSeasons tvId={media.tmdbId} seasons={media.seasons} />
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
                <div className="rounded-2xl p-12 text-center surface">
                  <Eye className="mx-auto size-6 text-muted-foreground" />

                  <h3 className="mt-4 font-heading text-xl font-semibold">
                    Watch it first
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
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
            <div className="rounded-2xl p-12 text-center surface">
              <Search className="mx-auto size-6 text-muted-foreground" />

              <h3 className="mt-4 font-heading text-xl font-semibold">
                No reviews yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Be the first to share your thoughts about this{' '}
                {media.type === 'movie' ? 'movie' : 'TV series'}.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Similar / recommendations                                        */}
      {/* ---------------------------------------------------------------- */}

      <section className="border-t border-border/60">
        <MediaRecommendations
          media={media.similar}
          title={`Similar ${media.type === 'movie' ? 'movies' : 'TV series'}`}
          eyebrow="If you liked this"
        />

        <MediaRecommendations
          media={media.recommendations}
          title={
            media.type === 'movie'
              ? 'More like these'
              : 'More like these series'
          }
          eyebrow="From TMDB"
        />
      </section>
    </main>
  );
};

export default MediaDetailsView;
