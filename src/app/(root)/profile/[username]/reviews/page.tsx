import ProfileNavbar from '@/components/profile/profile-navbar';
import { getPublicReviews } from '@/lib/services/profile-service';
import { Search, Star } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type ProfileReviewsPageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfileReviewsPage = async ({ params }: ProfileReviewsPageProps) => {
  const { username } = await params;

  const data = await getPublicReviews(username);

  if (!data) {
    notFound();
  }

  const { profile, reviews } = data;

  return (
    <main className="container-content py-12 lg:py-16">
      <header>
        <p className="eyebrow">@{profile.username}</p>

        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Reviews
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Movies and TV series this user has rated and reviewed.
        </p>

        <div className="mt-7">
          <ProfileNavbar username={profile.username} />
        </div>
      </header>

      <section className="py-10 lg:py-14">
        {reviews.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.map(({ review, media }) => {
              const href =
                media.type === 'movie'
                  ? `/movie/${media.tmdbId}`
                  : `/tv/${media.tmdbId}`;

              return (
                <article
                  key={review.id}
                  className="flex h-full flex-col rounded-2xl p-5 surface"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={href}
                      className="min-w-0 transition-colors hover:text-primary"
                    >
                      <p className="font-medium">
                        {media.title}
                        {media.releaseDate && (
                          <span className="text-muted-foreground">
                            {' '}
                            ({media.releaseDate.slice(0, 4)})
                          </span>
                        )}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {media.type === 'movie' ? 'Movie' : 'TV Series'}
                      </p>
                    </Link>

                    <p className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-rating">
                      <Star className="size-3.5 fill-current" />
                      {review.rating}/10
                    </p>
                  </div>

                  {review.title && (
                    <h2 className="mt-3 font-heading text-lg font-semibold">
                      {review.title}
                    </h2>
                  )}

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {review.content}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-xs text-muted-foreground">
                    <span>
                      Reviewed:{' '}
                      {review.createdAt.toLocaleDateString('en', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    {review.updatedAt.getTime() >
                      review.createdAt.getTime() && (
                      <>
                        <span aria-hidden="true">·</span>

                        <span>
                          Edited:{' '}
                          {review.updatedAt.toLocaleDateString('en', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl p-12 text-center surface">
            <Search className="mx-auto size-6 text-muted-foreground" />

            <h2 className="mt-4 font-heading text-xl font-semibold">
              No reviews yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Reviews will appear here when this user starts writing about
              movies and TV series.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfileReviewsPage;
