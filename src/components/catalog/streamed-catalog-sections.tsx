import RankedMediaList from '@/components/catalog/ranked-media-list';
import MediaCarousel from '@/components/media/media-carousel';
import TvScheduleCarousel from '@/components/tv/tv-schedule-carousel';
import {
  getMovieFeaturedSections,
  getMovieReleaseSections,
  getTvFeaturedSections,
  getTvScheduleSections,
} from '@/lib/services/media-catalog-service';

const groupClassName = 'space-y-14 lg:space-y-20';

export async function MovieFeaturedCatalogSections() {
  const sections = await getMovieFeaturedSections();

  return (
    <div className={groupClassName}>
      <MediaCarousel
        eyebrow="Popular picks"
        title="Most popular"
        description="The movies getting the most attention right now."
        media={sections.popular.slice(0, 20)}
      />

      <MediaCarousel
        eyebrow="Trending now"
        title="What's hot today"
        description="The movies everyone seems to be talking about right now."
        media={sections.trending.slice(0, 20)}
      />

      <RankedMediaList
        eyebrow="Weekly top 10"
        title="Top picks this week"
        description="The biggest movies of the week, ranked."
        media={sections.topPicks.slice(0, 10)}
      />
    </div>
  );
}

export async function MovieReleaseCatalogSections() {
  const sections = await getMovieReleaseSections();

  return (
    <div className={groupClassName}>
      <MediaCarousel
        eyebrow="In cinemas"
        title="Now playing"
        description="Movies currently showing in cinemas."
        media={sections.nowPlaying.slice(0, 20)}
      />

      <MediaCarousel
        eyebrow="Upcoming"
        title="Coming soon"
        description="A first look at movies on the horizon."
        media={sections.upcoming.slice(0, 20)}
      />

      <MediaCarousel
        eyebrow="All-time favorites"
        title="Top rated"
        description="Some of the highest-rated movies worth discovering."
        media={sections.topRated.slice(0, 20)}
      />
    </div>
  );
}

export async function TvFeaturedCatalogSections() {
  const sections = await getTvFeaturedSections();

  return (
    <div className={groupClassName}>
      <MediaCarousel
        eyebrow="Popular picks"
        title="Most popular"
        description="The series getting the most attention right now."
        media={sections.popular.slice(0, 20)}
      />

      <MediaCarousel
        eyebrow="Trending now"
        title="What's hot today"
        description="The series everyone seems to be talking about right now."
        media={sections.trending.slice(0, 20)}
      />

      <RankedMediaList
        eyebrow="Weekly top 10"
        title="Top picks this week"
        description="The biggest shows of the week, ranked."
        media={sections.topPicks.slice(0, 10)}
      />
    </div>
  );
}

export async function TvScheduleCatalogSections() {
  const sections = await getTvScheduleSections();

  return (
    <div className={groupClassName}>
      <TvScheduleCarousel
        eyebrow="Airing today"
        title="On today"
        description="Series with new episodes airing today."
        items={sections.airingToday}
      />

      <TvScheduleCarousel
        eyebrow="Currently airing"
        title="On the air"
        description="Series currently in active release."
        items={sections.onTheAir}
      />

      <MediaCarousel
        eyebrow="All-time favorites"
        title="Top rated"
        description="Some of the highest-rated series worth discovering."
        media={sections.topRated.slice(0, 20)}
      />
    </div>
  );
}
