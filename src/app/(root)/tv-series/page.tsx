import MediaCatalog from '@/components/catalog/media-catalog';
import { getTvCatalogSections } from '@/lib/services/media-catalog-service';

export default async function TvSeriesPage() {
  const sections = await getTvCatalogSections();

  return (
    <MediaCatalog
      eyebrow="Explore"
      title="TV Series"
      description="Discover what's worth watching, from what's trending now to all-time favorites."
      blocks={[
        {
          type: 'carousel',
          eyebrow: 'Popular picks',
          title: 'Most popular',
          description: 'The series getting the most attention right now.',
          media: sections.popular,
        },
        {
          type: 'carousel',
          eyebrow: 'Trending now',
          title: "What's hot this week",
          description:
            'The series everyone seems to be talking about right now.',
          media: sections.trending,
        },
        {
          type: 'ranking',
          eyebrow: 'Weekly top 10',
          title: 'Top 10 TV series this week',
          description: 'The biggest shows of the week, ranked.',
          media: sections.topPicks,
        },
        {
          type: 'carousel',
          eyebrow: 'Airing today',
          title: 'On today',
          description: 'Series with new episodes airing today.',
          media: sections.airingToday,
        },
        {
          type: 'carousel',
          eyebrow: 'Currently airing',
          title: 'On the air',
          description: 'Series currently in active release.',
          media: sections.onTheAir,
        },
        {
          type: 'carousel',
          eyebrow: 'All-time favorites',
          title: 'Top rated',
          description: 'Some of the highest-rated series worth discovering.',
          media: sections.topRated,
        },
      ]}
    />
  );
}
