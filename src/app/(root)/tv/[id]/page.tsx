import MediaDetailsView from '@/components/media/media-details-view';
import { requireSession } from '@/lib/auth/require-session';
import { getMediaDetailsPageData } from '@/lib/services/media-service';
import { notFound } from 'next/navigation';

type TvDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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
    />
  );
};

export default TvDetailsPage;
