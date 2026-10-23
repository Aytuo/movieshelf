import {
  MediaCommunityPostsSection,
  MediaCommunityReviewsSection,
} from '@/components/media/media-community-sections';
import MediaDetailsView from '@/components/media/media-details-view';
import {
  MediaCommunityPostsSkeleton,
  MediaCommunityReviewsSkeleton,
} from '@/components/skeletons/media-skeletons';
import { requireSession } from '@/lib/auth/require-session';
import {
  getMediaDetails,
  getMediaDetailsCorePageData,
} from '@/lib/services/media-service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type TvDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: TvDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const tmdbId = Number(id);

  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    return {};
  }

  try {
    const media = await getMediaDetails('tv', tmdbId);

    const year = media.releaseDate ? media.releaseDate.slice(0, 4) : null;

    return {
      title: year ? `${media.title} (${year})` : media.title,
      description:
        media.overview ||
        `${media.title}${year ? ` (${year})` : ''} TV series details, cast, episodes and reviews.`,
    };
  } catch {
    return {};
  }
}

const TvDetailsPage = async ({ params }: TvDetailsPageProps) => {
  const { id } = await params;

  const tmdbId = Number(id);

  if (!Number.isInteger(tmdbId)) {
    notFound();
  }

  const session = await requireSession();

  const data = await getMediaDetailsCorePageData(
    'tv',
    tmdbId,
    session.user.id
  ).catch(() => notFound());

  return (
    <MediaDetailsView
      media={data.media}
      mediaInteraction={data.mediaInteraction}
      existingReview={data.existingReview}
      watchNumber={data.watchNumber}
      reviewsSection={
        <Suspense fallback={<MediaCommunityReviewsSkeleton />}>
          <MediaCommunityReviewsSection
            mediaRecordId={data.mediaRecordId}
            mediaType="tv"
          />
        </Suspense>
      }
      postsSection={
        <Suspense fallback={<MediaCommunityPostsSkeleton />}>
          <MediaCommunityPostsSection
            mediaRecordId={data.mediaRecordId}
            userId={session.user.id}
            mediaType="tv"
            tmdbId={data.media.tmdbId}
          />
        </Suspense>
      }
    />
  );
};

export default TvDetailsPage;
