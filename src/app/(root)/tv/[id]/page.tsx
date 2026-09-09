import MediaDetailsView from '@/components/media/media-details-view';
import { requireSession } from '@/lib/auth/require-session';
import {
  getMediaDetails,
  getMediaDetailsPageData,
} from '@/lib/services/media-service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

  let data;

  try {
    data = await getMediaDetailsPageData('tv', tmdbId, session.user.id);
  } catch {
    notFound();
  }

  return (
    <MediaDetailsView
      media={data.media}
      mediaInteraction={data.mediaInteraction}
      existingReview={data.existingReview}
      reviews={data.reviews}
      watchNumber={data.watchNumber}
      posts={data.posts}
      postCursor={data.postCursor}
    />
  );
};

export default TvDetailsPage;
