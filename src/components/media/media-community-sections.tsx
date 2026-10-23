import PostList from '@/components/posts/post-list';
import ReviewCard from '@/components/reviews/review-card';
import EmptyState from '@/components/ui/empty-state';
import type { MediaType } from '@/lib/media';
import {
  getMediaDetailsPosts,
  getMediaDetailsReviews,
} from '@/lib/services/media-service';
import { MessageSquareText } from 'lucide-react';

type MediaCommunityReviewsSectionProps = {
  mediaRecordId: string;
  mediaType: MediaType;
};

export async function MediaCommunityReviewsSection({
  mediaRecordId,
  mediaType,
}: MediaCommunityReviewsSectionProps) {
  const reviews = await getMediaDetailsReviews(mediaRecordId);

  return (
    <section className="border-t border-border/60 bg-surface/20">
      <div className="container-content py-14 lg:py-20">
        <div className="mb-8">
          <p className="eyebrow">From the community</p>

          <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight">
            Reviews
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            See what other people thought about this{' '}
            {mediaType === 'movie' ? 'movie' : 'TV series'}.
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviews.map(({ review, profile }) => (
              <ReviewCard key={review.id} review={review} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-12 surface">
            <EmptyState
              icon={MessageSquareText}
              title="No reviews yet"
              description={
                <>
                  Be the first to share your thoughts about this{' '}
                  {mediaType === 'movie' ? 'movie' : 'TV series'}.
                </>
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

type MediaCommunityPostsSectionProps = {
  mediaRecordId: string;
  userId: string;
  mediaType: MediaType;
  tmdbId: number;
};

export async function MediaCommunityPostsSection({
  mediaRecordId,
  userId,
  mediaType,
  tmdbId,
}: MediaCommunityPostsSectionProps) {
  const postsPage = await getMediaDetailsPosts(mediaRecordId, userId);

  return (
    <PostList
      posts={postsPage.posts}
      postCursor={postsPage.nextCursor}
      type={mediaType}
      tmdbId={tmdbId}
    />
  );
}
