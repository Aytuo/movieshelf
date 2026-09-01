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
                <article key={review.id} className="rounded-2xl p-5 surface">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={href}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {media.title}
                    </Link>

                    <span className="shrink-0 text-[10px] tracking-wide text-muted-foreground uppercase">
                      {media.type === 'movie' ? 'Movie' : 'TV Series'}
                    </span>
                  </div>

                  {review.title && (
                    <h2 className="mt-3 font-heading text-lg font-semibold">
                      {review.title}
                    </h2>
                  )}

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {review.content}
                  </p>

                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rating">
                    <Star className="size-3.5 fill-current" />
                    {review.rating}/10
                  </p>
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
