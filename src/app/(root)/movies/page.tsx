import MediaCatalog from '@/components/catalog/media-catalog';
import { getMovieCatalogSections } from '@/lib/services/media-catalog-service';

export default async function MoviesPage() {
  const sections = await getMovieCatalogSections();

  return (
    <MediaCatalog
      eyebrow="Explore"
      title="Movies"
      description="Discover what's worth watching, from what's trending now to timeless favorites."
      blocks={[
        {
          type: 'carousel',
          eyebrow: 'Popular picks',
          title: 'Most popular',
          description: 'The movies getting the most attention right now.',
          media: sections.popular,
        },
        {
          type: 'carousel',
          eyebrow: 'Trending now',
          title: "What's hot this week",
          description:
            'The movies everyone seems to be talking about right now.',
          media: sections.trending,
        },
        {
          type: 'ranking',
          eyebrow: 'Weekly top 10',
          title: 'Top 10 movies this week',
          description: 'The biggest movies of the week, ranked.',
          media: sections.topPicks,
        },
        {
          type: 'carousel',
          eyebrow: 'In cinemas',
          title: 'Now playing',
          description: 'Movies currently showing in cinemas.',
          media: sections.nowPlaying,
        },
        {
          type: 'carousel',
          eyebrow: 'Upcoming',
          title: 'Coming soon',
          description: 'A first look at movies on the horizon.',
          media: sections.upcoming,
        },
        {
          type: 'carousel',
          eyebrow: 'All-time favorites',
          title: 'Top rated',
          description: 'Some of the highest-rated movies worth discovering.',
          media: sections.topRated,
        },
      ]}
    />
  );
}
